export type PostFormMode = 'create' | 'edit';

export interface PostFormProps {
  username: string;
  mode: PostFormMode;
  postId?: number;
  initialPosition?: number;
}

export type PostFormLoadState = 'loading' | 'ready' | 'error';
