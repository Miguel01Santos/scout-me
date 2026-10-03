import { AccountType } from '../../enums/account-type';
import { Configuration } from '../configuration/type';

export interface Account {
  id?: number;
  type: AccountType;
  isPrivate?: boolean;
  configuration?: Configuration;
}

export interface UpdateAccountInput {
  isPrivate: boolean;
}
