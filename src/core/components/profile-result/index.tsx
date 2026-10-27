'use client';

import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';
import { AccountType } from '../../enums/account-type';
import { toAvatarColor } from '../../enums/avatar-color';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { getDisplayName } from '../../utils/get-display-name';
import { AccountTypeTag } from '../account-type-tag';
import { ProfileAvatar } from '../profile-avatar';
import { ProfileResultProps } from './type';

export function ProfileResult({ profile, onSelect, onRemove }: ProfileResultProps) {
  const themeClasses = useThemeClasses();
  const name = getDisplayName(profile.name, profile);

  return (
    <div
      className={`flex items-center border rounded-2xl transition ${themeClasses.card} ${themeClasses.cardHover}`}
    >
      <Link
        href={`/perfil/${profile.username}`}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 p-3"
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
        {!onRemove && <ChevronRight size={16} className={`shrink-0 ${themeClasses.subText}`} />}
      </Link>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${name} das pesquisas recentes`}
          className={`mr-2 shrink-0 rounded-lg p-2 transition hover:opacity-80 ${themeClasses.subText}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
