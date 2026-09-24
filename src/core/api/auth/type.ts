import { User } from '../user/type';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
