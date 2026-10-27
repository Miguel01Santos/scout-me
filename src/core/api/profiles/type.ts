import { AccountType } from '../../enums/account-type';
import { ClubAction } from '../../enums/club';
import { DiscoverFilter } from '../../enums/discover-filter';
import { FollowStatus } from '../../enums/follow-status';
import { PlayerCategory, PlayerPosition, PreferredFoot } from '../../enums/player-attributes';
import { PlayerLevel } from '../../enums/player-level';
import { PlayerAttributes } from '../player-attributes/type';
import { RatingActions, RatingSummary } from '../ratings/type';

export interface ProfileCard {
  username: string;
  type: AccountType | null;
  name: string;
  displayName: string | null;
  showDisplayName: boolean;
  avatarUrl: string | null;
  avatarColor: string | null;
}

export interface PublicProfile extends ProfileCard, RatingSummary {
  isPrivate: boolean;
  bio: string | null;
  playerAttributes: PlayerAttributes | null;
  followersCount: number;
  followingCount: number;
  isOwner: boolean;
  followStatus: FollowStatus | null;
  canViewDetails: boolean;
  ratingActions: RatingActions | null;
  club: ProfileCard | null;
  clubAction: ClubAction | null;
  athletesCount: number | null;
}

export interface FollowRequest extends ProfileCard {
  requestedAt: string;
}

export type ProfileSearchFilter = Exclude<DiscoverFilter, DiscoverFilter.LOCATIONS>;

export interface PlayerSearchFilters {
  position: PlayerPosition | null;
  preferredFoot: PreferredFoot | null;
  category: PlayerCategory | null;
  level: PlayerLevel | null;
}

export interface SearchProfilesInput extends PlayerSearchFilters {
  search: string;
  filter: ProfileSearchFilter;
}
