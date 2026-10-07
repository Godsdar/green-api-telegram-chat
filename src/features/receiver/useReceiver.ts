import { useEffect } from 'react';
import { useDeleteNotificationMutation, useLazyReceiveNotificationQuery } from '../../api/greenApi';
import { POLL_ERROR_DELAY_MS, POLL_IDLE_DELAY_MS } from '../../config';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ingestNotification } from '../chats/ingest';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Long-poll loop: receiveNotification -> ingest -> deleteNotification.
 *
 * Only one poll is ever in flight (the loop awaits each request), which keeps
 * the FIFO queue consistent and avoids duplicate deliveries. Deduplication by
 * idMessage happens inside the chat store as a second safety net.
 */
export const useReceiver = () => {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state) => state.connection.status === 'connected');
  const [triggerReceive] = useLazyReceiveNotificationQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  useEffect(() => {
    if (!isConnected) return undefined;
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        try {
          const notification = await triggerReceive(undefined, false).unwrap();
          if (cancelled) break;

          if (notification && notification.body) {
            ingestNotification(dispatch, notification.body);
            try {
              await deleteNotification(notification.receiptId).unwrap();
            } catch {
              // The item stays in the queue and will be redelivered; the dedup
              // guard prevents a duplicate bubble.
            }
          } else {
            await sleep(POLL_IDLE_DELAY_MS);
          }
        } catch {
          await sleep(POLL_ERROR_DELAY_MS);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isConnected, dispatch, triggerReceive, deleteNotification]);
};
