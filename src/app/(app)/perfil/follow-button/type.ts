import { FollowStatus } from '@/src/core/enums/follow-status';

export interface FollowButtonProps {
  status: FollowStatus;
  isBusy: boolean;
  onPress: () => void;
}
