import { describe, expect, it } from 'vitest';
import type { RootState } from '../../app/store';
import type { Chat, ChatsState } from './chatsSlice';
import { selectActiveChat, selectActiveChatId, selectChatList } from './selectors';

const chat = (over: Partial<Chat> & { chatId: string }): Chat => ({
  title: over.chatId,
  messages: [],
  unread: 0,
  lastActivity: 0,
  ...over,
});

const stateWith = (chats: ChatsState): RootState => ({ chats }) as unknown as RootState;

const chatsState = (over: Partial<ChatsState> = {}): ChatsState => ({
  byId: {},
  allIds: [],
  activeChatId: null,
  seenMessageIds: [],
  ...over,
});

describe('selectChatList', () => {
  it('sorts chats by most recent activity first', () => {
    const state = stateWith(
      chatsState({
        byId: {
          a: chat({ chatId: 'a', lastActivity: 100 }),
          b: chat({ chatId: 'b', lastActivity: 300 }),
          c: chat({ chatId: 'c', lastActivity: 200 }),
        },
        allIds: ['a', 'b', 'c'],
      }),
    );

    expect(selectChatList(state).map((c) => c.chatId)).toEqual(['b', 'c', 'a']);
  });

  it('skips ids that have no matching chat', () => {
    const state = stateWith(
      chatsState({
        byId: {
          a: chat({ chatId: 'a', lastActivity: 100 }),
          b: chat({ chatId: 'b', lastActivity: 300 }),
        },
        allIds: ['a', 'missing', 'b'],
      }),
    );

    expect(selectChatList(state).map((c) => c.chatId)).toEqual(['b', 'a']);
  });

  it('returns an empty list when there are no chats', () => {
    expect(selectChatList(stateWith(chatsState()))).toEqual([]);
  });
});

describe('selectActiveChat', () => {
  it('returns the chat referenced by activeChatId', () => {
    const target = chat({ chatId: 'b', lastActivity: 300 });
    const state = stateWith(
      chatsState({
        byId: { a: chat({ chatId: 'a' }), b: target },
        allIds: ['a', 'b'],
        activeChatId: 'b',
      }),
    );

    expect(selectActiveChatId(state)).toBe('b');
    expect(selectActiveChat(state)).toBe(target);
  });

  it('returns null when nothing is active', () => {
    const state = stateWith(chatsState({ byId: { a: chat({ chatId: 'a' }) }, allIds: ['a'] }));
    expect(selectActiveChat(state)).toBeNull();
  });

  it('returns null when activeChatId points at a missing chat', () => {
    const state = stateWith(chatsState({ activeChatId: 'ghost' }));
    expect(selectActiveChat(state)).toBeNull();
  });
});
