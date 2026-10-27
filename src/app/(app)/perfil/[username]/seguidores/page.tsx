'use client';

import { use, useCallback } from 'react';
import { getProfileFollowers } from '@/src/core/api/profiles/service';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfilesList } from '@/src/core/components/profiles-list';

export default function ProfileFollowersPage({ params }: PageProps<'/perfil/[username]/seguidores'>) {
  const username = decodeURIComponent(use(params).username);
  const load = useCallback((accessToken: string) => getProfileFollowers(accessToken, username), [username]);

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Seguidores" />
      <ProfilesList load={load} emptyMessage="Ninguém segue este perfil ainda." />
    </main>
  );
}
