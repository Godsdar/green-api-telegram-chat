import { useCallback } from 'react';
import { useSendMessageMutation } from '../../api/greenApi';
import { useAppDispatch } from '../../app/hooks';
import { addOptimistic, confirmOutgoing, failOutgoing } from '../chats/chatsSlice';

/** Sends a text message: optimistic bubble first, reconcile with idMessage. */
export const useSendMessage = () => {
  const dispatch = useAppDispatch();
  const [sendMessage] = useSendMessageMutation();

  return useCallback(
    async (chatId: string, rawText: string): Promise<boolean> => {
      const text = rawText.trim();
      if (!text) return false;

      const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      dispatch(addOptimistic({ chatId, text, tempId }));

      try {
        const response = await sendMessage({ chatId, message: text }).unwrap();
        dispatch(confirmOutgoing({ tempId, idMessage: response.idMessage }));
        return true;
      } catch {
        dispatch(failOutgoing({ tempId }));
        return false;
      }
    },
    [dispatch, sendMessage],
  );
};
