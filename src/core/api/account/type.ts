import { AccountType } from '../../enums/account-type';
import { Configuration } from '../configuration/type';
import { Profile } from '../profile/type';

export interface Account {
  id?: number;
  type: AccountType;
  isPrivate?: boolean;
  configuration?: Configuration;
  profile?: Profile;
}

export interface UpdateAccountInput {
  isPrivate: boolean;
}
