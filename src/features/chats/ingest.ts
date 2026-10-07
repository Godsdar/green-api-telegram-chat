import type { AppDispatch } from '../../app/store';
import { isIncomingText, isOutgoingStatus, type GreenApiNotification } from '../../api/types';
import { applyStatus, receiveIncoming } from './chatsSlice';

/**
 * Routes a raw notification from receiveNotification into the chat store.
 * Only text incoming messages and outgoing statuses are handled - the task is
 * intentionally text-only.
 */
export const ingestNotification = (
  dispatch: AppDispatch,
  notification: GreenApiNotification,
): void => {
  if (isIncomingText(notification)) {
    const { senderData, messageData, idMessage, timestamp } = notification;
    dispatch(
      receiveIncoming({
        chatId: senderData.chatId,
        idMessage,
        text: messageData.textMessageData.textMessage,
        timestamp: timestamp || Math.floor(Date.now() / 1000),
        title: senderData.chatName || senderData.senderName || senderData.senderContactName,
      }),
    );
    return;
  }

  if (isOutgoingStatus(notification)) {
    const map: Record<string, 'sent' | 'delivered' | 'read' | 'failed'> = {
      sent: 'sent',
      delivered: 'delivered',
      read: 'read',
      failed: 'failed',
      noAccount: 'failed',
      notInGroup: 'failed',
    };
    const status = map[notification.status];
    if (status) dispatch(applyStatus({ idMessage: notification.idMessage, status }));
  }
};
