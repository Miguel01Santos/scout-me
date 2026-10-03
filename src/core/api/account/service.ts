import { get, patch } from '../index';
import { UpdateConfigurationInput } from '../configuration/type';
import { UpdateProfileInput } from '../profile/type';
import { Account, UpdateAccountInput } from './type';

export function getAccount(accessToken: string) {
  return get<{ account: Account }>('/account/me', accessToken);
}

export function updateConfiguration(accessToken: string, input: UpdateConfigurationInput) {
  return patch<{ account: Account }>('/account/me/configuration', accessToken, input);
}

export function updateAccount(accessToken: string, input: UpdateAccountInput) {
  return patch<{ account: Account }>('/account/me', accessToken, input);
}

export function updateProfile(accessToken: string, input: UpdateProfileInput) {
  return patch<{ account: Account }>('/account/me/profile', accessToken, input);
}
