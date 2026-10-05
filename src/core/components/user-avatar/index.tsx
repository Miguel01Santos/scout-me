'use client';

import { toAvatarColor } from '../../enums/avatar-color';
import { useAccount } from '../../providers/account';
import { getDisplayName } from '../../utils/get-display-name';
import { resolveAvatarUrl } from '../../utils/resolve-avatar-url';
import { ProfileAvatar } from '../profile-avatar';
import { UserAvatarProps } from './type';

export function UserAvatar({ name, avatarUrl, size }: UserAvatarProps) {
  const { account } = useAccount();

  return (
    <ProfileAvatar
      name={getDisplayName(name, account?.profile)}
      avatarUrl={resolveAvatarUrl(account?.profile, avatarUrl)}
      color={toAvatarColor(account?.profile?.avatarColor)}
      size={size}
    />
  );
}
