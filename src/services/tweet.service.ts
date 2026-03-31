import { AxiosError } from 'axios';
import type { Tweet, TweetBackend } from '../types/tweet.types';
import { api } from './api.service';

export async function fetchFeed(currentUserId: string): Promise<Tweet[]> {
  try {
    const response = await api.get('/feed');

    const tweets: Tweet[] = response.data.data.map((tweet: TweetBackend) => ({
      id: tweet.id,
      content: tweet.content,
      author: {
        id: tweet.author.id,
        name: tweet.author.name,
        username: tweet.author.username,
        imageUrl: tweet.author.imageUrl
      },
      createdAt: tweet.createdAt,
      likesCount: tweet.likes.length,
      likedByUser: tweet.likes.some((like) => like.author.id === currentUserId),
      replies: (tweet.replies || []).map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: {
          id: reply.author.id,
          name: reply.author.name,
          username: reply.author.username,
          imageUrl: reply.author.imageUrl
        },
        likesCount: reply.likes.length,
        likedByUser: reply.likes.some(
          (like) => like.author.id === currentUserId
        )
      }))
    }));

    return tweets;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      console.error('Token inválido ou expirado.');
    } else {
      console.error('Erro ao sincronizar feed.');
    }

    return [];
  }
}

export async function likeTweet(tweetId: string): Promise<boolean> {
  try {
    await api.post('/likes', { tweetId });
    return true;
  } catch {
    console.error('Erro ao processar o like.');
    return false;
  }
}

export async function unlikeTweet(tweetId: string): Promise<boolean> {
  try {
    await api.delete('/likes', { data: { tweetId } });
    return true;
  } catch {
    console.error('Erro ao remover like.');
    return false;
  }
}
