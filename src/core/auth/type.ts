import { Account } from '../api/account/type';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  account?: Account;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
