import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_API_URL } from '../../config';

export interface CredentialsState {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export const initialCredentialsState: CredentialsState = {
  apiUrl: DEFAULT_API_URL,
  idInstance: '',
  apiTokenInstance: '',
};

const slice = createSlice({
  name: 'credentials',
  initialState: initialCredentialsState,
  reducers: {
    setCredentials(state, action: PayloadAction<CredentialsState>) {
      state.apiUrl = action.payload.apiUrl.trim() || DEFAULT_API_URL;
      state.idInstance = action.payload.idInstance.trim();
      state.apiTokenInstance = action.payload.apiTokenInstance.trim();
    },
    clearCredentials(state) {
      state.idInstance = '';
      state.apiTokenInstance = '';
    },
  },
});

export const { setCredentials, clearCredentials } = slice.actions;
export const credentialsReducer = slice.reducer;
