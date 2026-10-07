import { describe, expect, it } from 'vitest';
import {
  addOptimistic,
  applyStatus,
  chatsReducer,
  confirmOutgoing,
  failOutgoing,
  receiveIncoming,
  setActiveChat,
  type ChatsState,
} from './chatsSlice';

const baseState: ChatsState = {
  byId: {},
  allIds: [],
  activeChatId: null,
  seenMessageIds: [],
};

describe('chatsSlice', () => {
  it('adds an incoming message and creates the chat', () => {
    const state = chatsReducer(
      baseState,
      receiveIncoming({ chatId: '100', idMessage: 'm1', text: 'hi', timestamp: 1000 }),
    );
    expect(state.byId['100']?.messages).toHaveLength(1);
    expect(state.byId['100']?.messages[0]?.text).toBe('hi');
    expect(state.seenMessageIds).toContain('m1');
  });

  it('dedupes incoming messages by idMessage', () => {
    const once = chatsReducer(
      baseState,
      receiveIncoming({ chatId: '100', idMessage: 'm1', text: 'hi', timestamp: 1000 }),
    );
    const twice = chatsReducer(
      once,
      receiveIncoming({ chatId: '100', idMessage: 'm1', text: 'hi', timestamp: 1000 }),
    );
    expect(twice.byId['100']?.messages).toHaveLength(1);
  });

  it('increments unread for non-active chats', () => {
    const withActive = { ...baseState, activeChatId: 'other' };
    const state = chatsReducer(
      withActive,
      receiveIncoming({ chatId: '100', idMessage: 'm1', text: 'hi', timestamp: 1000 }),
    );
    expect(state.byId['100']?.unread).toBe(1);
  });

  it('clears unread when a chat becomes active', () => {
    const withUnread = chatsReducer(
      baseState,
      receiveIncoming({ chatId: '100', idMessage: 'm1', text: 'hi', timestamp: 1000 }),
    );
    expect(withUnread.byId['100']?.unread).toBe(1);

    const activated = chatsReducer(withUnread, setActiveChat('100'));
    expect(activated.activeChatId).toBe('100');
    expect(activated.byId['100']?.unread).toBe(0);
  });

  it('optimistically adds an outgoing message then confirms it', () => {
    const pending = chatsReducer(
      baseState,
      addOptimistic({ chatId: '100', text: 'hey', tempId: 't1' }),
    );
    expect(pending.byId['100']?.messages[0]?.status).toBe('pending');

    const confirmed = chatsReducer(
      pending,
      confirmOutgoing({ tempId: 't1', idMessage: 'server-1' }),
    );
    const message = confirmed.byId['100']?.messages[0];
    expect(message?.id).toBe('server-1');
    expect(message?.status).toBe('sent');
    expect(confirmed.seenMessageIds).toContain('server-1');
  });

  it('marks a failed outgoing message', () => {
    const pending = chatsReducer(
      baseState,
      addOptimistic({ chatId: '100', text: 'hey', tempId: 't1' }),
    );
    const failed = chatsReducer(pending, failOutgoing({ tempId: 't1' }));
    expect(failed.byId['100']?.messages[0]?.status).toBe('failed');
  });

  it('applies an outgoing status update', () => {
    const state = chatsReducer(
      {
        ...baseState,
        byId: {
          '100': {
            chatId: '100',
            title: '100',
            messages: [
              {
                id: 'server-1',
                chatId: '100',
                text: 'hey',
                timestamp: 1,
                outgoing: true,
                status: 'sent',
              },
            ],
            unread: 0,
            lastActivity: 0,
          },
        },
        allIds: ['100'],
      },
      applyStatus({ idMessage: 'server-1', status: 'delivered' }),
    );
    expect(state.byId['100']?.messages[0]?.status).toBe('delivered');
  });
});
