'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/src/core/api';
import { getPendingRatings } from '@/src/core/api/account/service';
import { PendingRating } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { FollowRequestsSkeleton } from '../../pedidos/follow-requests-skeleton';
import { PendingRatingRow } from '../pending-rating-row';

export function PendingRatingsList() {
  const { publishPendingRating, hidePendingRating } = useAccount();
  const themeClasses = useThemeClasses();
  const [ratings, setRatings] = useState<PendingRating[] | null>(null);
  const [busyUsername, setBusyUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getPendingRatings(session.accessToken)
      .then(({ ratings: loadedRatings }) => setRatings(loadedRatings))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiError ? error.message : 'Não foi possível carregar as avaliações.'
        );
        setRatings([]);
      });
  }, []);

  async function answer(username: string, publish: boolean) {
    setErrorMessage('');
    setBusyUsername(username);

    try {
      await (publish ? publishPendingRating : hidePendingRating)(username);
      setRatings((current) => current?.filter((rating) => rating.rater.username !== username) ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setBusyUsername(null);
    }
  }

  if (!ratings) return <FollowRequestsSkeleton />;

  return (
    <section className="space-y-3">
      <p className={`text-xs ${themeClasses.subText}`}>
        Compartilhar publica a avaliação no seu perfil e ela passa a contar na sua nota. Remover tira
        a avaliação da lista sem apagar, e ela não aparece no seu perfil.
      </p>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {!errorMessage && ratings.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>Nenhuma avaliação pendente.</p>
      )}

      {ratings.map((rating) => (
        <PendingRatingRow
          key={rating.rater.username}
          rating={rating}
          isBusy={busyUsername === rating.rater.username}
          onPublish={() => answer(rating.rater.username, true)}
          onHide={() => answer(rating.rater.username, false)}
        />
      ))}
    </section>
  );
}
