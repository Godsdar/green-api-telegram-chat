import { useCallback, useEffect, useRef } from 'react';
import { useLazyGetStateInstanceQuery, useSetSettingsMutation } from '../../api/greenApi';
import type { GreenApiConfig, InstanceState } from '../../api/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetChats } from '../chats/chatsSlice';
import { clearCredentials, setCredentials } from '../credentials/credentialsSlice';
import { connected, connecting, connectionError, disconnected } from './connectionSlice';

/** Maps a non-authorized instance state to an i18n key. */
export const stateToMessageKey = (state: InstanceState): string => `connection.state.${state}`;

export const errorToMessageKey = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (status === 'CUSTOM_ERROR') return 'connection.error.missingCredentials';
    if (status === 'FETCH_ERROR') return 'connection.error.network';
    if (status === 401) return 'connection.error.unauthorized';
    if (typeof status === 'number') return 'connection.error.http';
  }
  return 'connection.error.unknown';
};

export const useConnection = () => {
  const dispatch = useAppDispatch();
  const credentials = useAppSelector((state) => state.credentials);
  const status = useAppSelector((state) => state.connection.status);
  const stateInstance = useAppSelector((state) => state.connection.stateInstance);
  const error = useAppSelector((state) => state.connection.error);

  const [triggerGetState] = useLazyGetStateInstanceQuery();
  const [setSettings] = useSetSettingsMutation();
  const didAutoConnect = useRef(false);

  const verify = useCallback(async () => {
    dispatch(connecting());
    try {
      const response = await triggerGetState().unwrap();
      const state = response.stateInstance;

      if (state === 'authorized') {
        // Switch the instance to HTTP API receiving (empty webhookUrl) and
        // subscribe to the notifications we care about. Best-effort.
        await setSettings({
          webhookUrl: '',
          incomingWebhook: 'yes',
          outgoingWebhook: 'yes',
          stateWebhook: 'yes',
        })
          .unwrap()
          .catch(() => undefined);
        dispatch(connected(state));
      } else {
        dispatch(connectionError(stateToMessageKey(state)));
      }
    } catch (err) {
      dispatch(connectionError(errorToMessageKey(err)));
    }
  }, [dispatch, setSettings, triggerGetState]);

  const connect = useCallback(
    async (config: GreenApiConfig) => {
      dispatch(setCredentials(config));
      await verify();
    },
    [dispatch, verify],
  );

  const disconnect = useCallback(() => {
    dispatch(clearCredentials());
    dispatch(disconnected());
    dispatch(resetChats());
  }, [dispatch]);

  useEffect(() => {
    if (didAutoConnect.current) return;
    if (credentials.idInstance && credentials.apiTokenInstance) {
      didAutoConnect.current = true;
      void verify();
    }
  }, [credentials.idInstance, credentials.apiTokenInstance, verify]);

  return { status, stateInstance, error, credentials, connect, disconnect, verify };
};

export type ConnectionController = ReturnType<typeof useConnection>;
