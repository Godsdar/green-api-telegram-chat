import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createStore } from '../../app/store';
import { DEFAULT_API_URL } from '../../config';
import { useSendMessage } from './useSendMessage';

const setup = () => {
  const store = createStore({
    apiUrl: DEFAULT_API_URL,
    idInstance: '1',
    apiTokenInstance: 'token',
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(() => useSendMessage(), { wrapper });
  return { store, result };
};

const stubFetch = (response: { ok: boolean; status: number; body: string }) => {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    status: response.status,
    text: async () => response.body,
  }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSendMessage', () => {
  it('adds a pending bubble then confirms it with the server id', async () => {
    stubFetch({ ok: true, status: 200, body: JSON.stringify({ idMessage: 'srv-1' }) });
    const { store, result } = setup();

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current('100', 'hello');
    });

    expect(returned).toBe(true);
    const messages = store.getState().chats.byId['100']?.messages ?? [];
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ id: 'srv-1', text: 'hello', status: 'sent' });
    expect(store.getState().chats.seenMessageIds).toContain('srv-1');
  });

  it('marks the bubble as failed and keeps the local id when the request errors', async () => {
    stubFetch({ ok: false, status: 500, body: JSON.stringify({}) });
    const { store, result } = setup();

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current('100', 'hello');
    });

    expect(returned).toBe(false);
    const message = store.getState().chats.byId['100']?.messages[0];
    expect(message?.status).toBe('failed');
    expect(message?.id.startsWith('local-')).toBe(true);
  });

  it('trims the text before sending it to the API', async () => {
    const fetchMock = stubFetch({
      ok: true,
      status: 200,
      body: JSON.stringify({ idMessage: 'srv-2' }),
    });
    const { store, result } = setup();

    await act(async () => {
      await result.current('100', '  hi  ');
    });

    expect(store.getState().chats.byId['100']?.messages[0]?.text).toBe('hi');
    const requestInit = (fetchMock.mock.calls[0] as unknown as [unknown, RequestInit])[1];
    expect(JSON.parse(String(requestInit.body))).toMatchObject({ chatId: '100', message: 'hi' });
  });

  it('does nothing for blank input', async () => {
    const fetchMock = stubFetch({ ok: true, status: 200, body: '{}' });
    const { store, result } = setup();

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current('100', '   ');
    });

    expect(returned).toBe(false);
    expect(store.getState().chats.allIds).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
