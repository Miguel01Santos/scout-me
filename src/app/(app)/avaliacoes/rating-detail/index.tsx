'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/src/core/api';
import { getRating } from '@/src/core/api/ratings/service';
import { RatingItem } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { CriteriaBars } from '@/src/core/components/criteria-bars';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { StarRating } from '@/src/core/components/star-rating';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import {
  RATING_WEIGHTS,
  RatingStatus,
  averageOfCriteria,
  formatRatingScore,
  toStars,
} from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { formatDayLabel } from '@/src/core/utils/format-day-label';
import { formatTime } from '@/src/core/utils/format-time';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { RatingDetailLoadState, RatingDetailProps } from './type';

function statusLabel(rating: RatingItem) {
  if (rating.isPrivate) return 'Avaliação privada: só o atleta e quem avaliou veem';
  if (rating.status === RatingStatus.PENDING) return 'Pendente: esperando o atleta compartilhar';
  if (rating.status === RatingStatus.HIDDEN) return 'Não publicada no perfil do atleta';

  return null;
}

export function RatingDetail({ ratingId }: RatingDetailProps) {
  const themeClasses = useThemeClasses();
  const [rating, setRating] = useState<RatingItem | null>(null);
  const [loadState, setLoadState] = useState<RatingDetailLoadState>('loading');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getRating(session.accessToken, ratingId)
      .then(({ rating: loadedRating }) => {
        setRating(loadedRating);
        setLoadState('ready');
      })
      .catch((error) => {
        setLoadState(error instanceof ApiError && error.status === 404 ? 'not-found' : 'error');
      });
  }, [ratingId]);

  if (loadState !== 'ready' || !rating) {
    return (
      <>
        <PageHeader title="Avaliação" />
        <p className={`p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`}>
          {loadState === 'loading'
            ? 'Carregando…'
            : loadState === 'not-found'
              ? 'Avaliação não encontrada.'
              : 'Não foi possível carregar a avaliação. Tente novamente.'}
        </p>
      </>
    );
  }

  const { rater, rated, criteria } = rating;
  const ratedName = getDisplayName(rated.name, rated);
  const raterName = getDisplayName(rater.name, rater);
  const average = averageOfCriteria(criteria);
  const weight = rater.type ? RATING_WEIGHTS[rater.type] : undefined;
  const status = statusLabel(rating);

  return (
    <>
      <PageHeader title="Avaliação" />

      <section className={`space-y-4 rounded-2xl border p-4 ${themeClasses.card}`}>
        <Link href={`/perfil/${rated.username}`} className="flex items-center gap-3">
          <ProfileAvatar
            name={ratedName}
            avatarUrl={rated.avatarUrl}
            color={toAvatarColor(rated.avatarColor)}
            size="md"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-bold">{ratedName}</span>
              {rated.type && <AccountTypeTag type={rated.type} />}
            </span>
            <span className={`block truncate text-xs ${themeClasses.subText}`}>@{rated.username}</span>
          </span>
        </Link>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Média desta avaliação</span>
            <StarRating value={toStars(average)} />
          </div>
          <span className="text-3xl font-black text-amber-400">{formatRatingScore(average)}</span>
        </div>

        <CriteriaBars criteria={criteria} />

        {status && (
          <p className="rounded-xl border px-3 py-2 text-[11px] font-semibold text-slate-400">{status}</p>
        )}
      </section>

      <section className={`space-y-2 rounded-2xl border p-4 ${themeClasses.card}`}>
        <span className="text-[10px] font-bold uppercase text-slate-400">Avaliado por</span>
        <Link href={`/perfil/${rater.username}`} className="flex items-center gap-3">
          <ProfileAvatar
            name={raterName}
            avatarUrl={rater.avatarUrl}
            color={toAvatarColor(rater.avatarColor)}
            size="sm"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-bold">{raterName}</span>
              {rater.type && <AccountTypeTag type={rater.type} />}
            </span>
            <span className={`block truncate text-xs ${themeClasses.subText}`}>@{rater.username}</span>
          </span>
        </Link>
        <p className={`text-xs ${themeClasses.subText}`}>
          {weight !== undefined && !rating.isPrivate && `Peso ${weight} na nota do atleta · `}
          {formatDayLabel(rating.createdAt)}, {formatTime(rating.createdAt)}
        </p>
      </section>
    </>
  );
}
