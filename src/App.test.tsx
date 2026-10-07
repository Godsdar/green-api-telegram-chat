import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import App from './App';
import { createStore } from './app/store';
import { DEFAULT_API_URL } from './config';
import './i18n';

describe('App', () => {
  it('shows the connect screen when no credentials are stored', () => {
    const store = createStore({
      apiUrl: DEFAULT_API_URL,
      idInstance: '',
      apiTokenInstance: '',
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText(/подключите инстанс/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /подключиться/i })).toBeInTheDocument();
  });
});
