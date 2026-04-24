import { api } from './api.service';
import type {
  RegisterData,
  ResponseLogin,
  ResponseRegister
} from '../types/auth.types.ts';
import { isAxiosError } from 'axios';

export async function register(
  newUser: RegisterData
): Promise<ResponseRegister> {
  try {
    await api.post('/auth/register', newUser);

    return { success: true, message: 'Usuário criado com sucesso!' };
  } catch (error) {
    let message = 'Erro no cadastro. Tente novamente.';

    if (isAxiosError(error)) {
      const status = error.response?.status;
      const details = error.response?.data?.details;

      if (status === 400 && details?.[0]) {
        const { field, description } = details[0];

        if (description === 'Invalid value') {
          const fieldMap: Record<string, string> = {
            name: 'Nome deve ter no mínimo 3 caracteres.',
            username: 'Usuário deve ter no mínimo 3 caracteres.',
            password: 'Senha deve ter no mínimo 5 caracteres.',
            imageUrl: 'Link da imagem inválido.'
          };

          message = fieldMap[field] || 'Dados inválidos.';
        }
      } else if (status === 409) {
        message = 'Usuário já existe.';
      }
    }

    return { success: false, message };
  }
}

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
