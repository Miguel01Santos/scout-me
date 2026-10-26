import { AccountType } from '../../enums/account-type';
import { FollowStatus } from '../../enums/follow-status';
import { PlayerAttributes } from '../player-attributes/type';

export interface ProfileCard {
  username: string;
  type: AccountType | null;
  name: string;
  displayName: string | null;
  showDisplayName: boolean;
  avatarUrl: string | null;
  avatarColor: string | null;
}

export interface PublicProfile extends ProfileCard {
  isPrivate: boolean;
  bio: string | null;
  playerAttributes: PlayerAttributes | null;
  followersCount: number;
  followingCount: number;
  isOwner: boolean;
  followStatus: FollowStatus | null;
  canViewDetails: boolean;
}

export interface FollowRequest extends ProfileCard {
  requestedAt: string;
}
