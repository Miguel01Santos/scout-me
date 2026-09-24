export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string | null;
}
