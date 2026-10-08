/**
 * App entry point: mounts the MAX UI kit, the Redux store, i18n and global
 * styles around <App />.
 */
import { MaxUI } from '@maxhub/max-ui';
import '@maxhub/max-ui/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './i18n';
import './styles/app.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <MaxUI platform="ios" colorScheme="light">
      <Provider store={store}>
        <App />
      </Provider>
    </MaxUI>
  </React.StrictMode>,
);
