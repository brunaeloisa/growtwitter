import type { User, UserBackend } from './user.types';

export interface Tweet {
  id: string;
  author: User;
  content: string;
  likeCount: number;
  likedByUser: boolean;
  createdAt: string;
  type: 'NORMAL' | 'REPLY';
  replies?: Tweet[];
}

interface LikeBackend {
  author: UserBackend;
  createdAt: string;
  updatedAt: string;
}

export interface TweetBackend {
  id: string;
  content: string;
  type: 'REPLY' | 'NORMAL';
  createdAt: string;
  updatedAt: string;
  author: UserBackend;
  likes: LikeBackend[];
  replies?: TweetBackend[];
}
