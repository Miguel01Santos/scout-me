import { LucideIcon } from 'lucide-react';
import { RatingActions } from '@/src/core/api/ratings/type';
import { ClubAction } from '@/src/core/enums/club';
import { RatingActionStatus } from '@/src/core/enums/rating';

export type VisitorMenuOption =
  | 'rate'
  | 'rate-private'
  | 'request'
  | 'request-private'
  | 'club'
  | 'message';

export interface VisitorMenuOptionText {
  label: string;
  icon: LucideIcon;
  statusLabel?: Partial<Record<RatingActionStatus, string>>;
}

export interface VisitorProfileMenuProps {
  ratingActions: RatingActions | null;
  clubAction: ClubAction | null;
  username: string;
  onChange: () => void;
}
