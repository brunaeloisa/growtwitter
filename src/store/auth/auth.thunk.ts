import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../services/auth.service';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    const response = await login(username, password);

    if (response.error) {
      return rejectWithValue(response.error);
    }

    if (!response.data) {
      return rejectWithValue('Dados do usuário não encontrados.');
    }

    return response.data;
  }
);
