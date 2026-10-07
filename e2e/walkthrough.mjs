// Guided user-journey walkthrough.
// Drives the real dev server in a browser, mocks the GREEN-API gateway, and
// captures one screenshot per step plus a network log. Run: node e2e/walkthrough.mjs
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const HEADLESS = process.env.HEADLESS === '1';
const OUT = 'docs/walkthrough';
fs.mkdirSync(OUT, { recursive: true });

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

const browser = await chromium.launch({ headless: HEADLESS, slowMo: HEADLESS ? 0 : 400 });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const net = [];
page.on('request', (req) => {
  const m = req.url().match(/\/waInstance\d+\/([a-zA-Z]+)/);
  if (m) net.push(`→ ${req.method().padEnd(6)} ${m[1]}`);
});
page.on('console', (msg) => net.push(`[console.${msg.type()}] ${msg.text()}`));

await page.route(/\/waInstance\d+\//, async (route) => {
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

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`  shot: ${OUT}/${name}.png`);
};

console.log('STEP 1  open app (fresh, no credentials)');
await page.goto(BASE, { waitUntil: 'networkidle' });
await shot('01-auth-empty');

console.log('STEP 2  fill in the GREEN-API credentials');
await page.locator('input').nth(0).fill('1101000000');
await page.locator('input').nth(1).fill('a1b2c3d4e5f6a1b2c3d4e5f6');
await shot('02-auth-filled');

console.log('STEP 3  connect (getStateInstance -> setSettings)');
await page.getByRole('button', { name: 'Подключиться' }).click();
await page.getByRole('button', { name: 'Новый чат' }).waitFor();
await shot('03-connected-empty');

console.log('STEP 4  new chat dialog (enter recipient phone)');
await page.getByRole('button', { name: 'Новый чат' }).click();
await page.getByPlaceholder('79991234567').fill('7 999 123 45 67');
await shot('04-new-chat-dialog');

console.log('STEP 5  create chat (checkAccount) and receive messages');
await page.getByRole('button', { name: 'Найти и создать' }).click();
await page.getByText('Привет! Это ответ получателя в Telegram.').first().waitFor();
await shot('05-chat-incoming');

console.log('STEP 6  type a reply');
await page.getByPlaceholder('Введите сообщение').fill('Ответ из нашего React-чата');
await shot('06-typing');

console.log('STEP 7  send (sendMessage -> status ticks)');
await page.getByRole('button', { name: 'Отправить' }).click();
await page.getByText('Ответ из нашего React-чата').first().waitFor();
await page.waitForTimeout(300);
await shot('07-sent');

console.log('STEP 8  mobile: conversation replaces the list');
await page.setViewportSize({ width: 390, height: 780 });
await page.waitForTimeout(200);
await shot('08-mobile-chat');

await browser.close();
fs.writeFileSync(`${OUT}/network.log`, net.join('\n') + '\n');
console.log('\n--- network/console log ---');
console.log(net.join('\n'));
