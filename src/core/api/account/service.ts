import { get, patch } from '../index';
import { UpdateConfigurationInput } from '../configuration/type';
import { Account } from './type';

export function getAccount(accessToken: string) {
  return get<{ account: Account }>('/account/me', accessToken);
}

export function updateConfiguration(accessToken: string, input: UpdateConfigurationInput) {
  return patch<{ account: Account }>('/account/me/configuration', accessToken, input);
}
