import { describe, expect, it } from 'vitest';
import { buildUrl } from './baseQuery';
import type { GreenApiConfig } from './types';

const config: GreenApiConfig = {
  apiUrl: 'https://api.green-api.com/',
  idInstance: '1101000000',
  apiTokenInstance: 'token123',
};

describe('buildUrl', () => {
  it('builds a GET method url and trims the trailing slash', () => {
    expect(buildUrl(config, { method: 'getStateInstance' })).toBe(
      'https://api.green-api.com/waInstance1101000000/getStateInstance/token123',
    );
  });

  it('appends query params', () => {
    expect(
      buildUrl(config, { method: 'receiveNotification', params: { receiveTimeout: 10 } }),
    ).toBe(
      'https://api.green-api.com/waInstance1101000000/receiveNotification/token123?receiveTimeout=10',
    );
  });

  it('places receiptId after the token for deleteNotification', () => {
    expect(buildUrl(config, { method: 'deleteNotification', receiptId: 42 })).toBe(
      'https://api.green-api.com/waInstance1101000000/deleteNotification/token123/42',
    );
  });
});
