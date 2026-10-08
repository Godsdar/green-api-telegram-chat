/** DTOs and type guards for GREEN-API responses, kept close to the wire format. */
export interface GreenApiConfig {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export type InstanceState =
  | 'notAuthorized'
  | 'starting'
  | 'authorized'
  | 'sleepMode'
  | 'yellowCard'
  | 'blocked'
  | 'suspended';

export interface GetStateInstanceResponse {
  stateInstance: InstanceState;
}

export interface SetSettingsRequest {
  webhookUrl: string;
  outgoingWebhook?: 'yes' | 'no';
  stateWebhook?: 'yes' | 'no';
  incomingWebhook?: 'yes' | 'no';
}

export interface SetSettingsResponse {
  saveSettings: boolean;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface CheckAccountRequest {
  phoneNumber: number;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
}

/** A raw notification envelope returned by receiveNotification. */
export interface ReceiveNotificationResponse {
  receiptId: number;
  body: GreenApiNotification;
}

export interface DeleteNotificationResponse {
  result: boolean;
}

export interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: string;
}

export interface SenderData {
  chatId: string;
  sender: string;
  chatName?: string;
  senderName?: string;
  senderContactName?: string;
}

export interface TextMessageData {
  typeMessage: 'textMessage';
  textMessageData: {
    textMessage: string;
  };
}

export interface IncomingMessageReceived {
  typeWebhook: 'incomingMessageReceived';
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: TextMessageData | { typeMessage: string };
}

export interface OutgoingMessageStatus {
  typeWebhook: 'outgoingMessageStatus';
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'noAccount' | 'notInGroup';
  chatId: string;
}

export interface StateInstanceChanged {
  typeWebhook: 'stateInstanceChanged';
  instanceData: InstanceData;
  timestamp: number;
  stateInstance: InstanceState;
}

export type GreenApiNotification =
  | IncomingMessageReceived
  | OutgoingMessageStatus
  | StateInstanceChanged
  | { typeWebhook: string; [key: string]: unknown };

// --- Journals (optional history) ---

export interface ChatHistoryMessage {
  type: 'incoming' | 'outgoing';
  idMessage: string;
  timestamp: number;
  typeMessage: string;
  chatId: string;
  senderId?: string;
  senderName?: string;
  textMessage?: string;
}

export interface GetChatHistoryRequest {
  chatId: string;
  count?: number;
}

/** getChatHistory returns a JSON array of messages. */
export type GetChatHistoryResponse = ChatHistoryMessage[];

export const isIncomingText = (
  n: GreenApiNotification,
): n is IncomingMessageReceived & { messageData: TextMessageData } =>
  n.typeWebhook === 'incomingMessageReceived' &&
  'messageData' in n &&
  (n as IncomingMessageReceived).messageData.typeMessage === 'textMessage';

export const isOutgoingStatus = (n: GreenApiNotification): n is OutgoingMessageStatus =>
  n.typeWebhook === 'outgoingMessageStatus';

export const isStateChanged = (n: GreenApiNotification): n is StateInstanceChanged =>
  n.typeWebhook === 'stateInstanceChanged';
