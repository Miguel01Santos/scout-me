'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import { getPublicProfile } from '@/src/core/api/profiles/service';
import { PublicProfile } from '@/src/core/api/profiles/type';
import { rateProfile } from '@/src/core/api/ratings/service';
import { RatingCriteria } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import {
  RATING_CRITERIA,
  RATING_CRITERION_LABEL,
  RATING_WEIGHTS,
  RatingActionStatus,
  formatRatingScore,
} from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { CriterionPicker } from '../criterion-picker';
import { RatingFormSkeleton } from '../rating-form-skeleton';
import { RatingDraft, RatingFormLoadState, RatingFormProps } from './type';

const EMPTY_DRAFT = Object.fromEntries(RATING_CRITERIA.map((criterion) => [criterion, null])) as RatingDraft;

function isComplete(draft: RatingDraft): draft is RatingCriteria {
  return RATING_CRITERIA.every((criterion) => draft[criterion] !== null);
}

export function RatingForm({ username, isPrivate }: RatingFormProps) {
  const router = useRouter();
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [draft, setDraft] = useState<RatingDraft>(EMPTY_DRAFT);
  const [loadState, setLoadState] = useState<RatingFormLoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getPublicProfile(session.accessToken, username)
      .then(({ profile: loadedProfile }) => {
        if (loadedProfile.isOwner) {
          router.replace('/perfil');
          return;
        }

        setProfile(loadedProfile);
        setLoadState('ready');
      })
      .catch((error) => {
        setLoadState(error instanceof ApiError && error.status === 404 ? 'not-found' : 'error');
      });
  }, [username, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session = getSession();

    if (!session || !isComplete(draft)) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await rateProfile(session.accessToken, username, { ...draft, isPrivate });
      toast.success(isPrivate ? 'Avaliação privada salva' : 'Avaliação salva');
      router.replace(`/perfil/${username}`);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.');
      setIsSubmitting(false);
    }
  }

  const title = isPrivate ? 'Avaliação privada' : 'Avaliar';

  if (loadState === 'loading') {
    return (
      <>
        <PageHeader title={title} />
        <RatingFormSkeleton />
      </>
    );
  }

  if (loadState !== 'ready' || !profile) {
    return (
      <>
        <PageHeader title={title} />
        <p className={`p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`}>
          {loadState === 'not-found'
            ? 'Perfil não encontrado.'
            : 'Não foi possível carregar o perfil. Tente novamente.'}
        </p>
      </>
    );
  }

  const name = getDisplayName(profile.name, profile);
  const viewerWeight = account?.type ? RATING_WEIGHTS[account.type] : undefined;
  const average = isComplete(draft)
    ? RATING_CRITERIA.reduce((sum, criterion) => sum + draft[criterion], 0) / RATING_CRITERIA.length
    : null;

  const rateStatus = profile.ratingActions?.[isPrivate ? 'ratePrivately' : 'rate'];

  if (rateStatus !== RatingActionStatus.AVAILABLE) {
    return (
      <>
        <PageHeader title={title} />
        <p className={`p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`}>
          {rateStatus === RatingActionStatus.DONE
            ? `Você já avaliou ${name}. As próximas avaliações vão vir de jogos, treinos e competições.`
            : isPrivate
              ? 'Só scouts podem fazer avaliações privadas de players.'
              : 'Seu tipo de conta não pode avaliar este perfil.'}
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            name={name}
            avatarUrl={profile.avatarUrl}
            color={toAvatarColor(profile.avatarColor)}
            size="md"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{name}</span>
            <span className={`block truncate text-xs ${themeClasses.subText}`}>@{profile.username}</span>
          </span>
        </div>

        <p className={`rounded-xl border p-3 text-xs ${themeClasses.card} ${themeClasses.subText}`}>
          {isPrivate
            ? `Só ${name} vai ver esta avaliação. Ela não entra na nota, mas conta como avaliação.`
            : `Dê uma nota de 1 a 10 em cada critério. Sua avaliação tem peso ${viewerWeight} na nota de ${name}.`}{' '}
          A avaliação pelo perfil é única e não pode ser alterada depois. Ao enviar, você passa a seguir{' '}
          {name}.
        </p>

        {errorMessage && (
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
            {errorMessage}
          </p>
        )}

        {RATING_CRITERIA.map((criterion) => (
          <CriterionPicker
            key={criterion}
            label={RATING_CRITERION_LABEL[criterion]}
            value={draft[criterion]}
            isDisabled={isSubmitting}
            onChange={(value) => setDraft((current) => ({ ...current, [criterion]: value }))}
          />
        ))}

        <div className={`flex items-center justify-between text-xs ${themeClasses.subText}`}>
          <span>Média desta avaliação</span>
          <span className="text-lg font-black text-amber-400">
            {average === null ? '–' : formatRatingScore(average)}
          </span>
        </div>

        <button
          type="submit"
          disabled={!isComplete(draft) || isSubmitting}
          className="w-full py-2.5 rounded-xl bg-indigo-600 enabled:hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar avaliação
        </button>
      </form>
    </>
  );
}
