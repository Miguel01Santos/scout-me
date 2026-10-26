import { FollowRequest } from '@/src/core/api/profiles/type';

export interface FollowRequestRowProps {
  request: FollowRequest;
  isBusy: boolean;
  onAccept: () => void;
  onDecline: () => void;
}
