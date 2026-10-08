/**
 * Chat store: chats, messages, unread counters and the active chat. Sending is
 * optimistic (temp id -> confirmed id); incoming messages are deduped by
 * idMessage, and outgoing statuses are applied by idMessage.
 */
import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  /** Unix timestamp in seconds (same unit GREEN-API uses). */
  timestamp: number;
  outgoing: boolean;
  status?: MessageStatus;
}

export interface Chat {
  chatId: string;
  title: string;
  phoneNumber?: string;
  messages: ChatMessage[];
  unread: number;
  /** ms, used only for sorting the sidebar. */
  lastActivity: number;
}

export interface ChatsState {
  byId: Record<string, Chat>;
  allIds: string[];
  activeChatId: string | null;
  /** Dedup guard: every message id we have already rendered. */
  seenMessageIds: string[];
}

const initialState: ChatsState = {
  byId: {},
  allIds: [],
  activeChatId: null,
  seenMessageIds: [],
};

const nowSeconds = () => Math.floor(Date.now() / 1000);

function ensureChatInState(
  state: ChatsState,
  chatId: string,
  title?: string,
  phoneNumber?: string,
): Chat {
  const existing = state.byId[chatId];
  if (existing) {
    if (title && existing.title === chatId) existing.title = title;
    if (phoneNumber && !existing.phoneNumber) existing.phoneNumber = phoneNumber;
    return existing;
  }
  const chat: Chat = {
    chatId,
    title: title || chatId,
    phoneNumber,
    messages: [],
    unread: 0,
    lastActivity: Date.now(),
  };
  state.byId[chatId] = chat;
  state.allIds.unshift(chatId);
  return chat;
}

const touch = (chat: Chat, timestampSeconds: number) => {
  chat.lastActivity = timestampSeconds * 1000;
};

const slice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    ensureChat(
      state,
      action: PayloadAction<{ chatId: string; title?: string; phoneNumber?: string }>,
    ) {
      const { chatId, title, phoneNumber } = action.payload;
      ensureChatInState(state, chatId, title, phoneNumber);
      if (!state.activeChatId) state.activeChatId = chatId;
    },

    setActiveChat(state, action: PayloadAction<string | null>) {
      state.activeChatId = action.payload;
      if (action.payload) {
        const chat = state.byId[action.payload];
        if (chat) chat.unread = 0;
      }
    },

    receiveIncoming(
      state,
      action: PayloadAction<{
        chatId: string;
        idMessage: string;
        text: string;
        timestamp: number;
        title?: string;
      }>,
    ) {
      const { chatId, idMessage, text, timestamp, title } = action.payload;
      if (state.seenMessageIds.includes(idMessage)) return;

      const chat = ensureChatInState(state, chatId, title);
      chat.messages.push({
        id: idMessage,
        chatId,
        text,
        timestamp: timestamp || nowSeconds(),
        outgoing: false,
      });
      state.seenMessageIds.push(idMessage);
      touch(chat, timestamp || nowSeconds());
      if (state.activeChatId !== chatId) chat.unread += 1;
    },

    addOptimistic(
      state,
      action: PayloadAction<{ chatId: string; text: string; tempId?: string }>,
    ): void {
      const { chatId, text } = action.payload;
      const tempId = action.payload.tempId ?? `local-${nanoid(8)}`;
      const chat = ensureChatInState(state, chatId);
      chat.messages.push({
        id: tempId,
        chatId,
        text,
        timestamp: nowSeconds(),
        outgoing: true,
        status: 'pending',
      });
      touch(chat, nowSeconds());
    },

    confirmOutgoing(
      state,
      action: PayloadAction<{ tempId: string; idMessage: string; timestamp?: number }>,
    ) {
      const { tempId, idMessage, timestamp } = action.payload;
      for (const chat of Object.values(state.byId)) {
        const message = chat.messages.find((m) => m.id === tempId);
        if (message) {
          message.id = idMessage;
          message.status = 'sent';
          if (timestamp) message.timestamp = timestamp;
          state.seenMessageIds.push(idMessage);
          return;
        }
      }
    },

    failOutgoing(state, action: PayloadAction<{ tempId: string }>) {
      for (const chat of Object.values(state.byId)) {
        const message = chat.messages.find((m) => m.id === action.payload.tempId);
        if (message) {
          message.status = 'failed';
          return;
        }
      }
    },

    applyStatus(state, action: PayloadAction<{ idMessage: string; status: MessageStatus }>) {
      const { idMessage, status } = action.payload;
      for (const chat of Object.values(state.byId)) {
        const message = chat.messages.find((m) => m.id === idMessage);
        if (message) {
          message.status = status;
          return;
        }
      }
    },

    resetChats: () => initialState,
  },
});

export const {
  ensureChat,
  setActiveChat,
  receiveIncoming,
  addOptimistic,
  confirmOutgoing,
  failOutgoing,
  applyStatus,
  resetChats,
} = slice.actions;

export const chatsReducer = slice.reducer;
