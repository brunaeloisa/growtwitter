import { AxiosError } from 'axios';
import type { UserProfile } from '../types/user.types';
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
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      console.error('Token inválido ou expirado.');
    } else {
      console.error(err);
    }
    return null;
  }
}
