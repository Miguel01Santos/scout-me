'use client';

import Link from 'next/link';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { FollowRequestRowProps } from './type';

export function FollowRequestRow({ request, isBusy, onAccept, onDecline }: FollowRequestRowProps) {
  const themeClasses = useThemeClasses();
  const name = getDisplayName(request.name, request);

  return (
    <div className={`flex items-center gap-3 p-3 border rounded-2xl ${themeClasses.card}`}>
      <Link href={`/perfil/${request.username}`} className="flex min-w-0 flex-1 items-center gap-3">
        <ProfileAvatar
          name={name}
          avatarUrl={request.avatarUrl}
          color={toAvatarColor(request.avatarColor)}
          size="md"
        />
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold">{name}</span>
          <span className={`block truncate text-xs ${themeClasses.subText}`}>@{request.username}</span>
        </span>
      </Link>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onAccept}
          disabled={isBusy}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 enabled:hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={onDecline}
          disabled={isBusy}
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition enabled:hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.subText}`}
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
