'use client';

import { useEffect, useState } from 'react';
import { Button, toast } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import { cancelGivenRating, getGivenRatings, getReceivedRatings } from '@/src/core/api/ratings/service';
import { RatingItem } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { ProfileResultsSkeleton } from '@/src/core/components/profile-results-skeleton';
import { RatingCard } from '@/src/core/components/rating-card';
import { AccountType } from '@/src/core/enums/account-type';
import { RatingStatus } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { useAccount } from '@/src/core/providers/account';

const STATUS_BADGE: Record<RatingStatus, string> = {
  [RatingStatus.PENDING]: 'Pendente',
  [RatingStatus.PUBLISHED]: 'Publicada',
  [RatingStatus.HIDDEN]: 'Não publicada',
};

function badgeFor(rating: RatingItem) {
  return rating.isPrivate ? 'Privada' : STATUS_BADGE[rating.status];
}

export function RatingsActivity() {
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const [ratings, setRatings] = useState<RatingItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [ratingToCancel, setRatingToCancel] = useState<RatingItem | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const isScout = account?.type === AccountType.SCOUT;

  useEffect(() => {
    const session = getSession();

    if (!session || !account?.type) return;

    (account.type === AccountType.SCOUT ? getGivenRatings : getReceivedRatings)(session.accessToken)
      .then(({ ratings: loadedRatings }) => setRatings(loadedRatings))
      .catch((error) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível carregar as avaliações.');
        setRatings([]);
      });
  }, [account?.type]);

  async function cancelRating() {
    const session = getSession();

    if (!session || !ratingToCancel) return;

    setIsCancelling(true);

    try {
      await cancelGivenRating(session.accessToken, ratingToCancel.id);
      setRatings((current) => current?.filter((rating) => rating.id !== ratingToCancel.id) ?? null);
      setRatingToCancel(null);
      toast.success('Avaliação cancelada');
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível cancelar.');
    } finally {
      setIsCancelling(false);
    }
  }

  if (!ratings) return <ProfileResultsSkeleton />;

  return (
    <section className="space-y-3">
      <p className={`text-xs ${themeClasses.subText}`}>
        {isScout
          ? 'Todas as avaliações que você fez. As pendentes ainda podem ser canceladas.'
          : 'Avaliações que você recebeu e que estão no seu perfil, incluindo as privadas.'}
      </p>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {!errorMessage && ratings.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>
          {isScout ? 'Você ainda não fez nenhuma avaliação.' : 'Você ainda não recebeu avaliações.'}
        </p>
      )}

      {ratings.map((rating) => (
        <RatingCard
          key={rating.id}
          rating={rating}
          badge={isScout || rating.isPrivate ? badgeFor(rating) : undefined}
          action={
            isScout && rating.status === RatingStatus.PENDING ? (
              <button
                type="button"
                onClick={() => setRatingToCancel(rating)}
                className="text-xs font-bold text-rose-400"
              >
                Cancelar
              </button>
            ) : undefined
          }
        />
      ))}

      <DialogComponent
        isOpen={ratingToCancel !== null}
        onOpenChange={(isOpen) => !isOpen && setRatingToCancel(null)}
        className={themeClasses.bg}
        title="Cancelar avaliação?"
        body={
          <p>
            A avaliação ainda não foi aceita pelo atleta e vai ser apagada. Depois, você pode avaliar de
            novo pelo perfil dele.
          </p>
        }
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Voltar
            </Button>
            <Button variant="danger" onPress={cancelRating} isDisabled={isCancelling}>
              Cancelar avaliação
            </Button>
          </>
        }
      />
    </section>
  );
}
