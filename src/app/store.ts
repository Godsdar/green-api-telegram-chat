/**
 * Redux store: credentials, connection and chats slices plus the RTK Query
 * GREEN-API client. Saves credentials to localStorage on every change.
 */
import { configureStore } from '@reduxjs/toolkit';
import { greenApi } from '../api/greenApi';
import { chatsReducer } from '../features/chats/chatsSlice';
import { connectionReducer } from '../features/connection/connectionSlice';
import { credentialsReducer } from '../features/credentials/credentialsSlice';
import { loadCredentials, saveCredentials } from './persistence';

export const createStore = (preloadedCredentials = loadCredentials()) =>
  configureStore({
    reducer: {
      credentials: credentialsReducer,
      connection: connectionReducer,
      chats: chatsReducer,
      [greenApi.reducerPath]: greenApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
    preloadedState: preloadedCredentials ? { credentials: preloadedCredentials } : undefined,
  });

export const store = createStore();

let lastCredentials = store.getState().credentials;
store.subscribe(() => {
  const current = store.getState().credentials;
  if (current !== lastCredentials) {
    lastCredentials = current;
    saveCredentials(current);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
