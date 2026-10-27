import { ProfileCard } from '../profiles/type';

export interface PostPhoto {
  id: number;
  url: string;
  position: number;
}

export interface Post {
  id: number;
  position: number;
  description: string | null;
  createdAt: string;
  photos: PostPhoto[];
  mentions: ProfileCard[];
}

export interface CreatePostInput {
  position: number;
  description: string | null;
  photos: string[];
  mentions: string[];
}

export interface UpdatePostInput {
  position?: number;
  description?: string | null;
  mentions?: string[];
}
