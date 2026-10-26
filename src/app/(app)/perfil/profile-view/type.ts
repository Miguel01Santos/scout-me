import { ReactNode } from 'react';
import { AccountType } from '@/src/core/enums/account-type';
import { AvatarColor } from '@/src/core/enums/avatar-color';

export interface ProfileViewData {
  name: string;
  username: string;
  avatarUrl: string | null;
  avatarColor: AvatarColor | null;
  type: AccountType | null;
  followersCount: number;
  followingCount: number;
  bio: string | null;
}

export interface ProfileViewProps {
  profile: ProfileViewData;
  action?: ReactNode;
  children?: ReactNode;
}
