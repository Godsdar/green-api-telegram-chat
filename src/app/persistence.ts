import { STORAGE_KEY } from '../config';
import {
  initialCredentialsState,
  type CredentialsState,
} from '../features/credentials/credentialsSlice';

export const loadCredentials = (): CredentialsState | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<CredentialsState>;
    return {
      apiUrl:
        typeof parsed.apiUrl === 'string' && parsed.apiUrl.trim()
          ? parsed.apiUrl
          : initialCredentialsState.apiUrl,
      idInstance: typeof parsed.idInstance === 'string' ? parsed.idInstance : '',
      apiTokenInstance: typeof parsed.apiTokenInstance === 'string' ? parsed.apiTokenInstance : '',
    };
  } catch {
    return undefined;
  }
};

export const saveCredentials = (state: CredentialsState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors and private-mode restrictions.
  }
};
