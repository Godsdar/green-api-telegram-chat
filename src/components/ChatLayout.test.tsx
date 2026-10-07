import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../app/store';
import { DEFAULT_API_URL } from '../config';
import { receiveIncoming, setActiveChat } from '../features/chats/chatsSlice';
import '../i18n';
import { ChatLayout } from './ChatLayout';

const renderLayout = () => {
  const store = createStore({ apiUrl: DEFAULT_API_URL, idInstance: '1', apiTokenInstance: 't' });
  store.dispatch(
    receiveIncoming({
      chatId: '100',
      idMessage: 'm1',
      text: 'hello there',
      timestamp: 1700000000,
      title: 'Alice',
    }),
  );
  store.dispatch(setActiveChat('100'));

  render(
    <Provider store={store}>
      <ChatLayout onDisconnect={vi.fn()} />
    </Provider>,
  );
  return store;
};

describe('ChatLayout', () => {
  it('renders the chat list and the active conversation', () => {
    renderLayout();
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    // The text appears both as the last-message preview and as the bubble.
    expect(screen.getAllByText('hello there').length).toBeGreaterThanOrEqual(2);
  });

  it('renders the composer for the active chat', () => {
    renderLayout();
    expect(screen.getByPlaceholderText(/введите сообщение/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отправить/i })).toBeInTheDocument();
  });
});
