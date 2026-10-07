// Opens a LIVE (visible) Chrome window running the app with a mocked
// GREEN-API gateway, then keeps the process alive so the window stays open.
// Run: node e2e/live.mjs   (Ctrl+C or `pkill -f e2e/live.mjs` to close)
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const PROFILE = process.env.PROFILE_DIR || '/tmp/chrome-max-live';
const CHAT_ID = '10000000';
let receiveCount = 0;

const incoming = (i) => ({
  typeWebhook: 'incomingMessageReceived',
  instanceData: { idInstance: 1101000000, wid: CHAT_ID, typeInstance: 'telegram' },
  timestamp: Math.floor(Date.now() / 1000) - (i === 0 ? 90 : 40),
  idMessage: `in-${i}`,
  senderData: { chatId: CHAT_ID, sender: CHAT_ID, chatName: 'Alice', senderName: 'Alice' },
  messageData: {
    typeMessage: 'textMessage',
    textMessageData: {
      textMessage: i === 0 ? 'Привет! Это ответ получателя в Telegram.' : 'И второе сообщение.',
    },
  },
});

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: 'chrome',
  viewport: null, // use the real window size
  args: ['--start-fullscreen'],
});

await context.addInitScript(() => {
  localStorage.setItem(
    'green-api-chat.credentials.v1',
    JSON.stringify({
      apiUrl: 'https://api.green-api.test',
      idInstance: '1101000000',
      apiTokenInstance: 'live-demo-token',
    }),
  );
});

await context.route(/\/waInstance\d+\//, async (route) => {
  const method =
    route
      .request()
      .url()
      .match(/\/waInstance\d+\/([a-zA-Z]+)\//)?.[1] ?? '';
  const ok = (data, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
  switch (method) {
    case 'getStateInstance':
      return ok({ stateInstance: 'authorized' });
    case 'setSettings':
      return ok({ saveSettings: true });
    case 'checkAccount':
      return ok({ exist: true, chatId: CHAT_ID, username: '@alice' });
    case 'sendMessage':
      return ok({ idMessage: `srv-${Math.random().toString(36).slice(2, 8)}` });
    case 'deleteNotification':
      return ok({ result: true });
    case 'receiveNotification': {
      const i = receiveCount++;
      if (i < 2) return ok({ receiptId: i + 1, body: incoming(i) });
      return route.fulfill({ status: 204, body: '' });
    }
    default:
      return ok({});
  }
});

const page = context.pages()[0] ?? (await context.newPage());
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.bringToFront();
console.log('LIVE Chrome open at', BASE, '- close with: pkill -f e2e/live.mjs');

// Keep the process (and the window) open until killed.
await new Promise(() => {});
