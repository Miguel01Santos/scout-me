export interface VisitorProfileProps {
  username: string;
}

export type VisitorProfileLoadState = 'loading' | 'ready' | 'not-found' | 'error';
