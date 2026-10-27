import { AccountType } from '../../enums/account-type';
import { Configuration } from '../configuration/type';
import { PlayerAttributes } from '../player-attributes/type';
import { Profile } from '../profile/type';
import { ProfileCard } from '../profiles/type';
import { RatingSummary } from '../ratings/type';

export interface Account extends RatingSummary {
  id?: number;
  username: string;
  // `null` até a pessoa escolher o tipo na tela que vem depois do cadastro.
  type: AccountType | null;
  isPrivate?: boolean;
  configuration?: Configuration;
  profile?: Profile;
  // Só vem preenchido em conta Player; nos outros tipos é null.
  playerAttributes?: PlayerAttributes | null;
  followersCount: number;
  followingCount: number;
  pendingFollowRequestsCount: number;
  unreadNotificationsCount: number;
  reviewRatings: boolean;
  pendingRatingsCount: number;
  club: ProfileCard | null;
  athletesCount: number | null;
}

export interface UpdateAccountInput {
  isPrivate?: boolean;
  reviewRatings?: boolean;
}
