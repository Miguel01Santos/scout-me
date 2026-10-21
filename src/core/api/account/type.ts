import { AccountType } from '../../enums/account-type';
import { Configuration } from '../configuration/type';
import { Profile } from '../profile/type';

export interface Account {
  id?: number;
  // `null` até a pessoa escolher o tipo na tela que vem depois do cadastro.
  type: AccountType | null;
  isPrivate?: boolean;
  configuration?: Configuration;
  profile?: Profile;
}

export interface UpdateAccountInput {
  isPrivate: boolean;
}
