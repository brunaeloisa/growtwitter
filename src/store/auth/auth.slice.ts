import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/user.types';
import storage from 'redux-persist/es/storage';
import { persistReducer } from 'redux-persist';
import { loginThunk } from './auth.thunk';

type UserState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token']
};

export const { logout } = userSlice.actions;

export default persistReducer(authPersistConfig, userSlice.reducer);
