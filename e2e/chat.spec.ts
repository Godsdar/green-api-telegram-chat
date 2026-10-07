import { expect, test } from '@playwright/test';
import { installCredentials, mockGreenApi } from './helpers';

test.describe('GREEN-API chat', () => {
  test('shows the connect screen and blocks connect without credentials', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Подключите инстанс')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Подключиться' })).toBeDisabled();
    await page.screenshot({ path: 'docs/screenshots/01-connect.png' });
  });

  test('connects, receives and sends messages', async ({ page }) => {
    await installCredentials(page);
    await mockGreenApi(page);

    await page.goto('/');
    await expect(page.getByLabel('Подключено')).toBeVisible();

    await page.getByRole('button', { name: 'Новый чат' }).click();
    await page.getByPlaceholder('79991234567').fill('7 999 123 45 67');
    await page.getByRole('button', { name: 'Найти и создать' }).click();

    const messages = page.locator('.chat-window__messages');
    await expect(messages.getByText('Привет! Это тест со стороны получателя.')).toBeVisible();
    await expect(messages.getByText('Второе входящее сообщение.')).toBeVisible();

    await page.getByPlaceholder('Введите сообщение').fill('Ответ из React-чата');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(messages.getByText('Ответ из React-чата')).toBeVisible();

    await page.screenshot({ path: 'docs/screenshots/02-chat.png' });
  });

  test('mobile: opening a chat replaces the list with the conversation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await installCredentials(page);
    await mockGreenApi(page);

    await page.goto('/');
    await page.getByRole('button', { name: 'Новый чат' }).click();
    await page.getByPlaceholder('79991234567').fill('79991234567');
    await page.getByRole('button', { name: 'Найти и создать' }).click();

    const messages = page.locator('.chat-window__messages');
    await expect(messages.getByText('Привет! Это тест со стороны получателя.')).toBeVisible();
    await expect(page.locator('.sidebar')).toBeHidden();

    await page.screenshot({ path: 'docs/screenshots/03-mobile-chat.png' });
  });
});
