import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InstanceState } from '../../api/types';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectionState {
  status: ConnectionStatus;
  stateInstance: InstanceState | null;
  error: string | null;
}

const initialState: ConnectionState = {
  status: 'disconnected',
  stateInstance: null,
  error: null,
};

const slice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    connecting(state) {
      state.status = 'connecting';
      state.error = null;
    },
    connected(state, action: PayloadAction<InstanceState>) {
      state.status = 'connected';
      state.stateInstance = action.payload;
      state.error = null;
    },
    connectionError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    disconnected(state) {
      state.status = 'disconnected';
      state.stateInstance = null;
      state.error = null;
    },
  },
});

export const { connecting, connected, connectionError, disconnected } = slice.actions;
export const connectionReducer = slice.reducer;
