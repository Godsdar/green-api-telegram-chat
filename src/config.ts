/** Messenger used by this build. GREEN-API keeps one API shape across
 * Telegram / WhatsApp / MAX, so the app stays channel-agnostic. */
export const CHANNEL = 'telegram' as const;

/** Default gateway host. Users can override it in the connection form. */
export const DEFAULT_API_URL =
  (import.meta.env.VITE_DEFAULT_API_URL as string | undefined)?.trim() ||
  'https://api.green-api.com';

/** Long-poll timeout (seconds) for receiveNotification. Allowed range: 5..60. */
export const RECEIVE_TIMEOUT_SECONDS = 10;

/** Delay between empty polls / after a failed poll, in ms. */
export const POLL_IDLE_DELAY_MS = 1000;
export const POLL_ERROR_DELAY_MS = 3000;

/** Telegram messages can be up to 4096 characters. */
export const MAX_MESSAGE_LENGTH = 4096;

export const STORAGE_KEY = 'green-api-chat.credentials.v1';

export const INSTANCE_STATES = [
  'notAuthorized',
  'starting',
  'authorized',
  'sleepMode',
  'yellowCard',
  'blocked',
  'suspended',
] as const;
