import { Account } from '../api/account/type';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
  account?: Account;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  // Sessões salvas antes do refresh token não têm esse campo e caem no login quando o token vence.
  refreshToken?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SaveSessionOptions {
  remember?: boolean;
}
