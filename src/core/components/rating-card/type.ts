import { ReactNode } from 'react';
import { RatingItem } from '../../api/ratings/type';

export interface RatingCardProps {
  rating: RatingItem;
  badge?: string;
  action?: ReactNode;
}
