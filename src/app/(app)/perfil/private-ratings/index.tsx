'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from '@heroui/react';
import { getPrivateRatings } from '@/src/core/api/ratings/service';
import { PrivateRating } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import {
  averageOfCriteria,
  formatRatingScore,
  summarizeCriteria,
} from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { formatDayLabel } from '@/src/core/utils/format-day-label';
import { getDisplayName } from '@/src/core/utils/get-display-name';

export function PrivateRatingsSection() {
  const themeClasses = useThemeClasses();
  const [ratings, setRatings] = useState<PrivateRating[] | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getPrivateRatings(session.accessToken)
      .then(({ ratings: loadedRatings }) => setRatings(loadedRatings))
      .catch(() => setRatings([]));
  }, []);

  return (
    <section className="space-y-2">
      <h3 className="m-0 text-sm font-black">Avaliações privadas</h3>
      <p className={`text-xs ${themeClasses.subText}`}>
        Só você vê. Não entram na sua nota, mas contam como avaliação.
      </p>

      {!ratings && <Skeleton className={`h-20 w-full rounded-2xl ${themeClasses.skeleton}`} />}

      {ratings?.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>Nenhuma avaliação privada ainda.</p>
      )}

      {ratings?.map((rating) => {
        const name = getDisplayName(rating.rater.name, rating.rater);

        return (
          <div
            key={rating.rater.username}
            className={`space-y-2 rounded-2xl border p-3 ${themeClasses.card}`}
          >
            <div className="flex items-center gap-3">
              <Link
                href={`/perfil/${rating.rater.username}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <ProfileAvatar
                  name={name}
                  avatarUrl={rating.rater.avatarUrl}
                  color={toAvatarColor(rating.rater.avatarColor)}
                  size="md"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{name}</span>
                  <span className={`block text-xs ${themeClasses.subText}`}>
                    {formatDayLabel(rating.updatedAt ?? rating.createdAt)}
                  </span>
                </span>
              </Link>
              <span className="text-lg font-black text-amber-400">
                {formatRatingScore(averageOfCriteria(rating.criteria))}
              </span>
            </div>
            <p className={`text-xs ${themeClasses.subText}`}>{summarizeCriteria(rating.criteria)}</p>
          </div>
        );
      })}
    </section>
  );
}
