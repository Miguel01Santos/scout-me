import { Account } from '../account/type';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  account?: Account;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string | null;
}
