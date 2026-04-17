import { isAxiosError } from 'axios';
import type { User, UserBackend, UserProfile } from '../types/user.types';
import { api } from './api.service';
import { normalizeTweets } from './tweet.service';
import type { TweetBackend } from '../types/tweet.types';

export async function getUserProfileById(
  userId: string,
  currentUserId: string
): Promise<UserProfile | null> {
  try {
    const response = await api.get(`/users/${userId}`);
    const user = response.data.data;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      tweets: normalizeTweets(
        user.tweets.filter((tweet: TweetBackend) => tweet.type === 'NORMAL'),
        currentUserId
      )
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.error('Token inválido ou expirado.');
    } else {
      console.error(error);
    }
    return null;
  }
}

export async function followUser(userId: string): Promise<boolean> {
  try {
    await api.post('/followers', { userId });
    return true;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      return true;
    }

    console.error(`Erro ao seguir o usuário ${userId}.`);
    return false;
  }
}

export async function unfollowUser(userId: string): Promise<boolean> {
  try {
    await api.delete('/followers', { data: { userId } });
    return true;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return true;
    }
    console.error(`Erro ao deixar de seguir o usuário ${userId}.`);
    return false;
  }
}

export async function getUserData(userId: string): Promise<{
  imageUrl: string | null;
  following: string[];
}> {
  try {
    const response = await api.get(`/users/${userId}`);
    const user = response.data.data;

    return {
      imageUrl: user.imageUrl ?? null,
      following: user.following.map((user: UserBackend) => user.id) ?? []
    };
  } catch {
    console.error('Erro ao buscar dados do usário logado.');
    return {
      imageUrl: null,
      following: []
    };
  }
}

export async function getUserList(): Promise<User[]> {
  try {
    const response = await api.get('/users');
    const users: User[] = response.data.data;
    return [...users].reverse();
  } catch {
    console.error('Erro ao buscar lista de usuários.');
    return [];
  }
}
