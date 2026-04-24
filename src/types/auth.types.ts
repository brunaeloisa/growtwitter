import type { User } from './user.types';

export interface RegisterData {
  username: string;
  name: string;
  password: string;
  imageUrl?: string;
}

export interface ResponseRegister {
  success: boolean;
  message: string;
}

interface LoginData {
  user: User;
  token: string;
}

export interface ResponseLogin {
  error?: string;
  data?: LoginData;
}
