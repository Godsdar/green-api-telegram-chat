import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Chat } from './chatsSlice';

const selectChatsState = (state: RootState) => state.chats;

export const selectChatsById = (state: RootState) => state.chats.byId;

export const selectActiveChatId = (state: RootState) => state.chats.activeChatId;

export const selectChatList = createSelector([selectChatsState], (chats): Chat[] =>
  chats.allIds
    .map((id) => chats.byId[id])
    .filter((chat): chat is Chat => Boolean(chat))
    .sort((a, b) => b.lastActivity - a.lastActivity),
);

export const selectActiveChat = createSelector(
  [selectChatsById, selectActiveChatId],
  (byId, activeId): Chat | null => (activeId ? (byId[activeId] ?? null) : null),
);
