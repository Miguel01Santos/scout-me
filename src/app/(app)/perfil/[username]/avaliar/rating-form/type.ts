import { RatingCriterion } from '@/src/core/enums/rating';

export interface RatingFormProps {
  username: string;
  isPrivate: boolean;
}

export type RatingFormLoadState = 'loading' | 'ready' | 'not-found' | 'error';

export type RatingDraft = Record<RatingCriterion, number | null>;
