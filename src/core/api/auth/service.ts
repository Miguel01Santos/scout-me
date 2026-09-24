import { post } from '../index';
import { AuthSession, LoginInput, RegisterInput } from './type';

export function login(input: LoginInput) {
  return post<AuthSession>('/auth/login', input);
}

export function register(input: RegisterInput) {
  return post<AuthSession>('/auth/register', input);
}
