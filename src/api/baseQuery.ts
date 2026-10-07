import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '../app/store';
import type { GreenApiConfig } from './types';

export interface GreenApiQueryArgs {
  /** GREEN-API method name, e.g. "sendMessage". */
  method: string;
  httpMethod?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number>;
  /** Only for deleteNotification: the receipt id goes after the token. */
  receiptId?: number;
}

export interface GreenApiError {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'CUSTOM_ERROR';
  error?: string;
  data?: unknown;
}

export const buildUrl = (cfg: GreenApiConfig, args: GreenApiQueryArgs): string => {
  const base = cfg.apiUrl.replace(/\/+$/, '');
  const prefix = `${base}/waInstance${cfg.idInstance}/${args.method}/${cfg.apiTokenInstance}`;

  if (args.method === 'deleteNotification' && args.receiptId != null) {
    return `${prefix}/${args.receiptId}`;
  }
  if (args.params && Object.keys(args.params).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(args.params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return `${prefix}?${qs}`;
  }
  return prefix;
};

/**
 * Custom RTK Query base query. Instead of a fixed url it reads the instance
 * credentials from the Redux store, so every request is built on the fly and
 * the credentials never have to be passed through every call site.
 */
export const greenApiBaseQuery: BaseQueryFn<GreenApiQueryArgs, unknown, GreenApiError> = async (
  args,
  api,
) => {
  const cfg = (api.getState() as RootState).credentials;
  if (!cfg.idInstance || !cfg.apiTokenInstance || !cfg.apiUrl) {
    return { error: { status: 'CUSTOM_ERROR', error: 'missing-credentials' } };
  }

  const url = buildUrl(cfg, args);

  try {
    const response = await fetch(url, {
      method: args.httpMethod ?? 'GET',
      headers: args.body != null ? { 'Content-Type': 'application/json' } : undefined,
      body: args.body != null ? JSON.stringify(args.body) : undefined,
    });

    // GREEN-API answers 204 for an empty receiveNotification queue.
    if (response.status === 204) {
      return { data: null };
    }

    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        return { error: { status: 'PARSING_ERROR', error: text } };
      }
    }

    if (!response.ok) {
      return { error: { status: response.status, data: parsed } };
    }
    return { data: parsed };
  } catch (error) {
    return { error: { status: 'FETCH_ERROR', error: (error as Error).message } };
  }
};
