import { RatingCriteria } from '@/src/core/api/ratings/type';

export interface RatingCriteriaSectionProps {
  criteria: RatingCriteria | null;
  ratingScore: number;
}
