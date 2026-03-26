import { api } from './api.service';
import type { ResponseLogin } from '../types/auth.types.ts';
import { AxiosError } from 'axios';

export async function login(
  username: string,
  password: string
): Promise<ResponseLogin> {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { authUser, authToken } = response.data.data;

    return {
      data: {
        user: authUser,
        token: authToken
      }
    };
  } catch (err) {
    if (
      err instanceof AxiosError &&
      (err.response?.status === 401 || err.response?.status === 404)
    ) {
      return { error: 'Credenciais inválidas.' };
    }

    console.error('Erro no login:', err);

    return { error: 'Erro no login. Tente novamente.' };
  }
}
