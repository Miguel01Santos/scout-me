'use client';

import { use, useCallback } from 'react';
import { getProfileFollowing } from '@/src/core/api/profiles/service';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfilesList } from '@/src/core/components/profiles-list';

export default function ProfileFollowingPage({ params }: PageProps<'/perfil/[username]/seguindo'>) {
  const username = decodeURIComponent(use(params).username);
  const load = useCallback((accessToken: string) => getProfileFollowing(accessToken, username), [username]);

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Seguindo" />
      <ProfilesList load={load} emptyMessage="Este perfil ainda não segue ninguém." />
    </main>
  );
}
