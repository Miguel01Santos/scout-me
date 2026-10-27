import { RatingActionStatus, RatingCriterion, RatingStatus } from '../../enums/rating';
import { ProfileCard } from '../profiles/type';

export type RatingCriteria = Record<RatingCriterion, number>;

export interface RateProfileInput extends RatingCriteria {
  isPrivate: boolean;
}

export interface PrivateRating {
  rater: ProfileCard;
  criteria: RatingCriteria;
  createdAt: string;
  updatedAt: string | null;
}

export interface RatingSummary {
  ratingScore: number;
  ratingsCount: number;
  ratingCriteria: RatingCriteria | null;
}

export interface RatingActions {
  rate: RatingActionStatus;
  ratePrivately: RatingActionStatus;
  requestRating: RatingActionStatus;
  requestPrivateRating: RatingActionStatus;
}

export interface PendingRating {
  rater: ProfileCard;
  criteria: RatingCriteria;
  createdAt: string;
}

export interface RatingItem {
  id: number;
  isPrivate: boolean;
  status: RatingStatus;
  createdAt: string;
  rater: ProfileCard;
  rated: ProfileCard;
  criteria: RatingCriteria;
}
