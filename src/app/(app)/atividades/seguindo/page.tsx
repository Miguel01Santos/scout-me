'use client';

import { getFollowing } from '@/src/core/api/account/service';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfilesList } from '@/src/core/components/profiles-list';

export default function FollowingPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Seguindo" />
      <ProfilesList load={getFollowing} emptyMessage="Você ainda não segue ninguém." />
    </main>
  );
}
