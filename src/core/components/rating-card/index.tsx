'use client';

import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { toAvatarColor } from '../../enums/avatar-color';
import { averageOfCriteria, formatRatingScore, summarizeCriteria } from '../../enums/rating';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { formatDayLabel } from '../../utils/format-day-label';
import { getDisplayName } from '../../utils/get-display-name';
import { AccountTypeTag } from '../account-type-tag';
import { ProfileAvatar } from '../profile-avatar';
import { RatingCardProps } from './type';

export function RatingCard({ rating, badge, action }: RatingCardProps) {
  const themeClasses = useThemeClasses();
  const { rater, rated, criteria } = rating;
  const ratedName = getDisplayName(rated.name, rated);
  const raterName = getDisplayName(rater.name, rater);

  return (
    <article className={`space-y-2 rounded-2xl border p-3 ${themeClasses.card}`}>
      <div className="flex items-center gap-3">
        <Link href={`/perfil/${rated.username}`} className="shrink-0">
          <ProfileAvatar
            name={ratedName}
            avatarUrl={rated.avatarUrl}
            color={toAvatarColor(rated.avatarColor)}
            size="md"
          />
        </Link>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm">
            <Link href={`/perfil/${rater.username}`} className="font-bold">
              {raterName}
            </Link>{' '}
            avaliou{' '}
            <Link href={`/perfil/${rated.username}`} className="font-bold">
              {ratedName}
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {rater.type && <AccountTypeTag type={rater.type} />}
            {badge && (
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold text-slate-400">
                {badge}
              </span>
            )}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-lg font-black text-amber-400">
          <Star size={16} fill="currentColor" />
          {formatRatingScore(averageOfCriteria(criteria))}
        </span>
      </div>
      <p className={`text-xs ${themeClasses.subText}`}>{summarizeCriteria(criteria)}</p>
      <div className="flex items-center justify-between gap-2">
        <time dateTime={rating.createdAt} className={`text-[11px] ${themeClasses.subText}`}>
          {formatDayLabel(rating.createdAt)}
        </time>
        <div className="flex items-center gap-3">
          {action}
          <Link
            href={`/avaliacoes/${rating.id}`}
            className="flex items-center gap-0.5 text-xs font-bold text-indigo-500"
          >
            Ver avaliação
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
