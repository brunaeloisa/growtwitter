export interface User {
  id: string;
  username: string;
  name: string;
  imageUrl?: string;
}

export interface Tweet {
  id: string;
  author: User;
  content: string;
  likesCount: number;
  likedByUser: boolean;
  createdAt: string;
  type: 'NORMAL' | 'REPLY';
  replies?: Tweet[];
}

export interface AuthorBackend extends User {
  createdAt: string;
  updatedAt: string;
}

export interface LikeBackend {
  author: AuthorBackend;
  createdAt: string;
  updatedAt: string;
}

export interface TweetBackend {
  id: string;
  content: string;
  type: 'REPLY' | 'NORMAL';
  createdAt: string;
  updatedAt: string;
  author: AuthorBackend;
  likes: LikeBackend[];
  replies?: TweetBackend[];
}
