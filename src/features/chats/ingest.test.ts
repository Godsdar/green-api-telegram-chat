import { describe, expect, it } from 'vitest';
import type { AppDispatch } from '../../app/store';
import type { GreenApiNotification } from '../../api/types';
import { ingestNotification } from './ingest';

const capture = () => {
  const actions: { type: string; payload?: unknown }[] = [];
  const dispatch = ((action: { type: string; payload?: unknown }) => {
    actions.push(action);
    return action;
  }) as unknown as AppDispatch;
  return { actions, dispatch };
};

describe('ingestNotification', () => {
  it('maps an incoming text message to receiveIncoming', () => {
    const notification = {
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'm1',
      timestamp: 1700000000,
      senderData: { chatId: '100', sender: '100', chatName: 'Alice' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'hello' } },
    } as unknown as GreenApiNotification;

    const { actions, dispatch } = capture();
    ingestNotification(dispatch, notification);

    expect(actions).toHaveLength(1);
    expect(actions[0]?.type).toBe('chats/receiveIncoming');
    expect(actions[0]?.payload).toMatchObject({ chatId: '100', text: 'hello', title: 'Alice' });
  });

  it('maps an outgoing status to applyStatus', () => {
    const notification = {
      typeWebhook: 'outgoingMessageStatus',
      idMessage: 'm2',
      status: 'read',
      chatId: '100',
    } as unknown as GreenApiNotification;

    const { actions, dispatch } = capture();
    ingestNotification(dispatch, notification);

    expect(actions[0]?.type).toBe('chats/applyStatus');
    expect(actions[0]?.payload).toEqual({ idMessage: 'm2', status: 'read' });
  });

  it('ignores notifications it does not handle', () => {
    const notification = { typeWebhook: 'stateInstanceChanged' } as unknown as GreenApiNotification;
    const { actions, dispatch } = capture();
    ingestNotification(dispatch, notification);
    expect(actions).toHaveLength(0);
  });
});
