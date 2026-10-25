import { AccountType } from '../../enums/account-type';
import { get, patch, put } from '../index';
import { UpdateConfigurationInput } from '../configuration/type';
import { UpdatePlayerAttributesInput } from '../player-attributes/type';
import { UpdateProfileInput } from '../profile/type';
import { Account, UpdateAccountInput } from './type';

export function getAccount(accessToken: string) {
  return get<{ account: Account }>('/account/me', accessToken);
}

export function updateConfiguration(accessToken: string, input: UpdateConfigurationInput) {
  return patch<{ account: Account }>('/account/me/configuration', accessToken, input);
}

export function chooseAccountType(accessToken: string, type: AccountType) {
  return put<{ account: Account }>('/account/me/type', accessToken, { type });
}

export function updateAccount(accessToken: string, input: UpdateAccountInput) {
  return patch<{ account: Account }>('/account/me', accessToken, input);
}

export function updatePlayerAttributes(accessToken: string, input: UpdatePlayerAttributesInput) {
  return put<{ account: Account }>('/account/me/player-attributes', accessToken, input);
}

export function updateProfile(accessToken: string, input: UpdateProfileInput) {
  return patch<{ account: Account }>('/account/me/profile', accessToken, input);
}
