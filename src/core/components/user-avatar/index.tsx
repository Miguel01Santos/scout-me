'use client';

import { toAvatarColor } from '../../enums/avatar-color';
import { useAccount } from '../../providers/account';
import { getDisplayName } from '../../utils/get-display-name';
import { ProfileAvatar } from '../profile-avatar';
import { UserAvatarProps } from './type';

export function UserAvatar({ name, avatarUrl, size }: UserAvatarProps) {
  const { account } = useAccount();

  return (
    <ProfileAvatar
      name={getDisplayName(name, account?.profile)}
      avatarUrl={avatarUrl}
      color={toAvatarColor(account?.profile?.avatarColor)}
      size={size}
    />
  );
}
