import { AccountType } from '../../enums/account-type';
import { del, get, patch, postAuthenticated, put } from '../index';
import { FollowRequest } from '../profiles/type';
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

export function getFollowRequests(accessToken: string) {
  return get<{ requests: FollowRequest[] }>('/account/me/follow-requests', accessToken);
}

export function acceptFollowRequest(accessToken: string, username: string) {
  return postAuthenticated<{ account: Account }>(
    `/account/me/follow-requests/${encodeURIComponent(username)}`,
    accessToken
  );
}

export function declineFollowRequest(accessToken: string, username: string) {
  return del<{ account: Account }>(
    `/account/me/follow-requests/${encodeURIComponent(username)}`,
    accessToken
  );
}

export function updatePlayerAttributes(accessToken: string, input: UpdatePlayerAttributesInput) {
  return put<{ account: Account }>('/account/me/player-attributes', accessToken, input);
}

export function updateProfile(accessToken: string, input: UpdateProfileInput) {
  return patch<{ account: Account }>('/account/me/profile', accessToken, input);
}
