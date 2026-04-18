import { api } from './api.service';
import type { ResponseLogin } from '../types/auth.types.ts';
import { isAxiosError } from 'axios';

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
  } catch (error) {
    if (
      isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 404)
    ) {
      return { error: 'Credenciais inválidas.' };
    }

    console.error('Erro no login:', error);

    return { error: 'Erro no login. Tente novamente.' };
  }
}
