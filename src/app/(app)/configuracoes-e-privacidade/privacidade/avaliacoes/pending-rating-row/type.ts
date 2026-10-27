import { PendingRating } from '@/src/core/api/ratings/type';

export interface PendingRatingRowProps {
  rating: PendingRating;
  isBusy: boolean;
  onPublish: () => void;
  onHide: () => void;
}
