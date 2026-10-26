import { AccountType } from '../../enums/account-type';
import { Configuration } from '../configuration/type';
import { PlayerAttributes } from '../player-attributes/type';
import { Profile } from '../profile/type';

export interface Account {
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
}

export interface UpdateAccountInput {
  isPrivate: boolean;
}
