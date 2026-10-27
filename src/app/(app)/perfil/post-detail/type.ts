export interface PostDetailProps {
  username: string;
  postId: number;
}

export type PostDetailLoadState = 'loading' | 'ready' | 'not-found' | 'private' | 'error';
