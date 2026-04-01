import type { Tweet, TweetBackend } from './tweet.types';

export interface User {
  id: string;
  username: string;
  name: string;
  imageUrl?: string | null;
}

export interface UserProfile extends User {
  createdAt: string;
  followersCount: number;
  followingCount: number;
  tweets: Tweet[];
}

export interface UserBackend extends User {
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileBackend extends UserBackend {
  tweets: TweetBackend[];
  followers: UserBackend[];
  following: UserBackend[];
}
