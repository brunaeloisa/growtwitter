interface AuthUser {
  id: string;
  name: string;
  username: string;
  imageUrl?: string | null;
}

interface LoginData {
  user: AuthUser;
  token: string;
}

export interface ResponseLogin {
  error?: string;
  data?: LoginData;
}
