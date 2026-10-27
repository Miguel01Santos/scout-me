export interface RatingDetailProps {
  ratingId: number;
}

export type RatingDetailLoadState = 'loading' | 'ready' | 'not-found' | 'error';
