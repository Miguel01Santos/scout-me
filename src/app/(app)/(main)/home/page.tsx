'use client';

import { AccountType } from '@/src/core/enums/account-type';
import { useAccount } from '@/src/core/providers/account';
import { Feed } from './feed';
import { FeedSkeleton } from './feed-skeleton';
import { ScoutHome } from './scout-home';

export default function HomePage() {
  const { account, isLoading } = useAccount();

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      {isLoading || !account ? (
        <FeedSkeleton />
      ) : account.type === AccountType.SCOUT ? (
        <ScoutHome />
      ) : (
        <Feed />
      )}
    </main>
  );
}
