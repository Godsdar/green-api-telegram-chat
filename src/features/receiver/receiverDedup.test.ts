import { describe, expect, it } from 'vitest';
import type { GreenApiNotification } from '../../api/types';
import { createStore } from '../../app/store';
import { DEFAULT_API_URL } from '../../config';
import { addOptimistic, confirmOutgoing } from '../chats/chatsSlice';
import { ingestNotification } from '../chats/ingest';

const store = () =>
  createStore({ apiUrl: DEFAULT_API_URL, idInstance: '1', apiTokenInstance: 'token' });

const incoming = (idMessage: string): GreenApiNotification =>
  ({
    typeWebhook: 'incomingMessageReceived',
    idMessage,
    timestamp: 1700000000,
    senderData: { chatId: '100', sender: '100', chatName: 'Alice' },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'hi' } },
  }) as unknown as GreenApiNotification;

describe('receiver dedup via the chat store', () => {
  it('renders a redelivered notification only once', () => {
    const app = store();
    ingestNotification(app.dispatch, incoming('m1'));
    ingestNotification(app.dispatch, incoming('m1'));

    expect(app.getState().chats.byId['100']?.messages).toHaveLength(1);
  });

  it('ignores an incoming echo of an already-confirmed outgoing message', () => {
    const app = store();
    app.dispatch(addOptimistic({ chatId: '100', text: 'sent by me', tempId: 't1' }));
    app.dispatch(confirmOutgoing({ tempId: 't1', idMessage: 'srv-1' }));

    ingestNotification(app.dispatch, incoming('srv-1'));

    const messages = app.getState().chats.byId['100']?.messages ?? [];
    expect(messages).toHaveLength(1);
    expect(messages[0]?.outgoing).toBe(true);
  });
});
