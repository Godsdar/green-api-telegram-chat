import { describe, expect, it } from 'vitest';
import { errorToMessageKey, stateToMessageKey } from './useConnection';

describe('stateToMessageKey', () => {
  it('builds the i18n key from the instance state', () => {
    expect(stateToMessageKey('blocked')).toBe('connection.state.blocked');
    expect(stateToMessageKey('sleepMode')).toBe('connection.state.sleepMode');
  });
});

describe('errorToMessageKey', () => {
  it('maps a custom (missing credentials) error', () => {
    expect(errorToMessageKey({ status: 'CUSTOM_ERROR', error: 'missing-credentials' })).toBe(
      'connection.error.missingCredentials',
    );
  });

  it('maps a network failure', () => {
    expect(errorToMessageKey({ status: 'FETCH_ERROR', error: 'failed to fetch' })).toBe(
      'connection.error.network',
    );
  });

  it('maps 401 to unauthorized', () => {
    expect(errorToMessageKey({ status: 401 })).toBe('connection.error.unauthorized');
  });

  it('maps any other http status to a generic error', () => {
    expect(errorToMessageKey({ status: 500 })).toBe('connection.error.http');
    expect(errorToMessageKey({ status: 403 })).toBe('connection.error.http');
  });

  it('falls back to unknown for unhandled shapes', () => {
    expect(errorToMessageKey({ status: 'PARSING_ERROR' })).toBe('connection.error.unknown');
    expect(errorToMessageKey({})).toBe('connection.error.unknown');
    expect(errorToMessageKey(null)).toBe('connection.error.unknown');
    expect(errorToMessageKey('boom')).toBe('connection.error.unknown');
    expect(errorToMessageKey(undefined)).toBe('connection.error.unknown');
  });
});
