'use client';

import Link from 'next/link';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { averageOfCriteria, formatRatingScore, summarizeCriteria } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { formatDayLabel } from '@/src/core/utils/format-day-label';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { PendingRatingRowProps } from './type';

export function PendingRatingRow({ rating, isBusy, onPublish, onHide }: PendingRatingRowProps) {
  const themeClasses = useThemeClasses();
  const name = getDisplayName(rating.rater.name, rating.rater);

  return (
    <div className={`space-y-3 p-3 border rounded-2xl ${themeClasses.card}`}>
      <div className="flex items-center gap-3">
        <Link href={`/perfil/${rating.rater.username}`} className="flex min-w-0 flex-1 items-center gap-3">
          <ProfileAvatar
            name={name}
            avatarUrl={rating.rater.avatarUrl}
            color={toAvatarColor(rating.rater.avatarColor)}
            size="md"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{name}</span>
            <span className={`block truncate text-xs ${themeClasses.subText}`}>
              @{rating.rater.username} · {formatDayLabel(rating.createdAt)}
            </span>
          </span>
        </Link>
        <span className="text-lg font-black text-amber-400">
          {formatRatingScore(averageOfCriteria(rating.criteria))}
        </span>
      </div>

      <p className={`text-xs ${themeClasses.subText}`}>{summarizeCriteria(rating.criteria)}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={isBusy}
          className="flex-1 py-1.5 rounded-lg bg-indigo-600 enabled:hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Compartilhar
        </button>
        <button
          type="button"
          onClick={onHide}
          disabled={isBusy}
          className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition enabled:hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.subText}`}
        >
          Remover
        </button>
      </div>
    </div>
  );
}
