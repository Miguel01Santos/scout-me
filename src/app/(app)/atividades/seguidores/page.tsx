'use client';

import { getFollowers } from '@/src/core/api/account/service';
import { PageHeader } from '@/src/core/components/page-header';
import { ProfilesList } from '@/src/core/components/profiles-list';

export default function FollowersPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Seguidores" />
      <ProfilesList load={getFollowers} emptyMessage="Ninguém segue você ainda." />
    </main>
  );
}
