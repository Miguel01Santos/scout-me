import { get, patch } from '../index';
import { UpdateUserInput, User } from './type';

export function getUser(accessToken: string) {
  return get<{ user: User }>('/user/me', accessToken);
}

export function updateUser(accessToken: string, input: UpdateUserInput) {
  return patch<{ user: User }>('/user/me', accessToken, input);
}
