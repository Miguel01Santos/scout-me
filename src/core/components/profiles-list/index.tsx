'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '../../api';
import { ProfileCard } from '../../api/profiles/type';
import { getSession } from '../../auth';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { ProfileResult } from '../profile-result';
import { ProfileResultsSkeleton } from '../profile-results-skeleton';
import { ProfilesListProps } from './type';

export function ProfilesList({ load, emptyMessage }: ProfilesListProps) {
  const themeClasses = useThemeClasses();
  const [profiles, setProfiles] = useState<ProfileCard[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    load(session.accessToken)
      .then(({ profiles: loadedProfiles }) => setProfiles(loadedProfiles))
      .catch((error) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível carregar a lista.');
        setProfiles([]);
      });
  }, [load]);

  if (!profiles) return <ProfileResultsSkeleton />;

  return (
    <section className="space-y-3">
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}
      {!errorMessage && profiles.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>{emptyMessage}</p>
      )}
      {profiles.map((profile) => (
        <ProfileResult key={profile.username} profile={profile} />
      ))}
    </section>
  );
}
