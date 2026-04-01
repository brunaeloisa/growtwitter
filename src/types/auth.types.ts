import type { User } from './user.types';

interface LoginData {
  user: User;
  token: string;
}

export interface ResponseLogin {
  error?: string;
  data?: LoginData;
}
