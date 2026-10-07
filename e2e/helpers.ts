import type { Page } from '@playwright/test';

const CREDENTIALS_KEY = 'green-api-chat.credentials.v1';

export const TEST_CHAT_ID = '10000000';

/** Seeds credentials into localStorage before the app boots. */
export const installCredentials = async (page: Page): Promise<void> => {
  await page.addInitScript(
    ([key]) => {
      localStorage.setItem(
        key as string,
        JSON.stringify({
          apiUrl: 'https://api.green-api.test',
          idInstance: '1101000000',
          apiTokenInstance: 'test-token',
        }),
      );
    },
    [CREDENTIALS_KEY],
  );
};

const incomingNotification = (index: number) => ({
  typeWebhook: 'incomingMessageReceived',
  instanceData: { idInstance: 1101000000, wid: TEST_CHAT_ID, typeInstance: 'telegram' },
  timestamp: Math.floor(Date.now() / 1000) - (index === 0 ? 120 : 60),
  idMessage: `in-${index}`,
  senderData: {
    chatId: TEST_CHAT_ID,
    sender: TEST_CHAT_ID,
    chatName: 'Alice',
    senderName: 'Alice',
  },
  messageData: {
    typeMessage: 'textMessage',
    textMessageData: {
      textMessage:
        index === 0 ? 'Привет! Это тест со стороны получателя.' : 'Второе входящее сообщение.',
    },
  },
});

/**
 * Mocks the GREEN-API gateway so the UI can be exercised without real
 * credentials: it authorizes the instance and pushes two incoming messages.
 */
export const mockGreenApi = async (page: Page): Promise<void> => {
  let receiveCount = 0;

  await page.route(/\/waInstance\d+\//, async (route) => {
    const method =
      route
        .request()
        .url()
        .match(/\/waInstance\d+\/([a-zA-Z]+)\//)?.[1] ?? '';
    const json = (data: unknown, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });

    switch (method) {
      case 'getStateInstance':
        return json({ stateInstance: 'authorized' });
      case 'setSettings':
        return json({ saveSettings: true });
      case 'checkAccount':
        return json({ exist: true, chatId: TEST_CHAT_ID, username: '@alice' });
      case 'sendMessage':
        return json({ idMessage: `srv-${Math.random().toString(36).slice(2, 8)}` });
      case 'deleteNotification':
        return json({ result: true });
      case 'receiveNotification': {
        const index = receiveCount;
        receiveCount += 1;
        if (index < 2) {
          return json({ receiptId: index + 1, body: incomingNotification(index) });
        }
        return route.fulfill({ status: 204, body: '' });
      }
      default:
        return json({});
    }
  });
};
