/**
 * RTK Query API for the GREEN-API methods this app uses: getStateInstance,
 * setSettings, sendMessage, checkAccount, receiveNotification,
 * deleteNotification and getChatHistory. Text-only by design.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { RECEIVE_TIMEOUT_SECONDS } from '../config';
import { greenApiBaseQuery } from './baseQuery';
import type {
  CheckAccountRequest,
  CheckAccountResponse,
  DeleteNotificationResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  GetStateInstanceResponse,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
  SetSettingsRequest,
  SetSettingsResponse,
} from './types';

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery: greenApiBaseQuery,
  tagTypes: ['Instance', 'Chat'],
  endpoints: (build) => ({
    getStateInstance: build.query<GetStateInstanceResponse, void>({
      query: () => ({ method: 'getStateInstance' }),
      providesTags: ['Instance'],
    }),

    setSettings: build.mutation<SetSettingsResponse, Partial<SetSettingsRequest>>({
      query: (body) => ({
        method: 'setSettings',
        httpMethod: 'POST',
        body: { webhookUrl: '', ...body },
      }),
      invalidatesTags: ['Instance'],
    }),

    sendMessage: build.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({ method: 'sendMessage', httpMethod: 'POST', body }),
    }),

    checkAccount: build.mutation<CheckAccountResponse, CheckAccountRequest>({
      query: (body) => ({ method: 'checkAccount', httpMethod: 'POST', body }),
    }),

    receiveNotification: build.query<ReceiveNotificationResponse | null, void>({
      query: () => ({
        method: 'receiveNotification',
        params: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
      }),
    }),

    deleteNotification: build.mutation<DeleteNotificationResponse, number>({
      query: (receiptId) => ({
        method: 'deleteNotification',
        httpMethod: 'DELETE',
        receiptId,
      }),
    }),

    getChatHistory: build.query<GetChatHistoryResponse, GetChatHistoryRequest>({
      query: ({ chatId, count = 50 }) => ({
        method: 'getChatHistory',
        httpMethod: 'POST',
        body: { chatId, count },
      }),
      providesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetStateInstanceQuery,
  useLazyGetStateInstanceQuery,
  useSetSettingsMutation,
  useSendMessageMutation,
  useCheckAccountMutation,
  useReceiveNotificationQuery,
  useLazyReceiveNotificationQuery,
  useDeleteNotificationMutation,
  useGetChatHistoryQuery,
} = greenApi;
