import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../config';
import { initialCredentialsState } from '../features/credentials/credentialsSlice';
import { loadCredentials, saveCredentials } from './persistence';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadCredentials', () => {
  it('returns undefined when nothing is stored', () => {
    expect(loadCredentials()).toBeUndefined();
  });

  it('round-trips saved credentials', () => {
    saveCredentials({
      apiUrl: 'https://custom.example',
      idInstance: '42',
      apiTokenInstance: 'abc',
    });
    expect(loadCredentials()).toEqual({
      apiUrl: 'https://custom.example',
      idInstance: '42',
      apiTokenInstance: 'abc',
    });
  });

  it('returns undefined for malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadCredentials()).toBeUndefined();
  });

  it('falls back to defaults for a blank apiUrl and coerces bad fields to empty strings', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ apiUrl: '   ', idInstance: 42, apiTokenInstance: null }),
    );

    expect(loadCredentials()).toEqual({
      apiUrl: initialCredentialsState.apiUrl,
      idInstance: '',
      apiTokenInstance: '',
    });
  });

  it('survives a storage read error', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('access denied');
    });
    expect(loadCredentials()).toBeUndefined();
  });
});

describe('saveCredentials', () => {
  it('persists the state as JSON', () => {
    saveCredentials({
      apiUrl: 'https://custom.example',
      idInstance: '42',
      apiTokenInstance: 'abc',
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
      apiUrl: 'https://custom.example',
      idInstance: '42',
      apiTokenInstance: 'abc',
    });
  });

  it('swallows quota / private-mode errors', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() =>
      saveCredentials({ apiUrl: 'https://x', idInstance: '1', apiTokenInstance: 't' }),
    ).not.toThrow();
  });
});
