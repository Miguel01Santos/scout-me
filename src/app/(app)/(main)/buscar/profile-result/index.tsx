'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { AccountType } from '@/src/core/enums/account-type';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { ProfileResultProps } from './type';

export function ProfileResult({ profile }: ProfileResultProps) {
  const themeClasses = useThemeClasses();
  const name = getDisplayName(profile.name, profile);

  return (
    <Link
      href={`/perfil/${profile.username}`}
      className={`flex items-center gap-3 p-3 border rounded-2xl transition ${themeClasses.card} ${themeClasses.cardHover}`}
    >
      <ProfileAvatar
        name={name}
        avatarUrl={profile.avatarUrl}
        color={toAvatarColor(profile.avatarColor)}
        size="md"
      />
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-bold">{name}</span>
          {profile.type && profile.type !== AccountType.ORGANIZATION && (
            <AccountTypeTag type={profile.type} />
          )}
        </span>
        <span className={`block truncate text-xs ${themeClasses.subText}`}>@{profile.username}</span>
      </span>
      <ChevronRight size={16} className={`shrink-0 ${themeClasses.subText}`} />
    </Link>
  );
}
