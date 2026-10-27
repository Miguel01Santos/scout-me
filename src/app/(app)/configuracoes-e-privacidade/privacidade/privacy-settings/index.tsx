'use client';

import { useEffect } from 'react';
import { Star, UserPlus } from 'lucide-react';
import { useSession } from '@/src/core/auth/use-session';
import { LinkCard } from '@/src/core/components/link-card';
import { AccountType } from '@/src/core/enums/account-type';
import { useAccount } from '@/src/core/providers/account';
import { AccountVisibility } from '../account-visibility';
import { AccountVisibilitySkeleton } from '../account-visibility-skeleton';
import { PRIVACY_ROUTES } from '../constants';
import { RatingsApproval } from '../ratings-approval';

function withCount(label: string, count: number) {
  return count > 0 ? `${label} (${count})` : label;
}

export function PrivacySettings() {
  const { user } = useSession();
  const { account, isLoading, refreshAccount } = useAccount();

  useEffect(() => {
    refreshAccount().catch(() => undefined);
  }, [refreshAccount]);

  if (!user || isLoading || !account) return <AccountVisibilitySkeleton />;

  const isPlayer = account.type === AccountType.PLAYER;

  return (
    <>
      <AccountVisibility />

      {account.isPrivate && (
        <LinkCard
          label={withCount('Pedidos para seguir', account.pendingFollowRequestsCount)}
          href="/configuracoes-e-privacidade/privacidade/pedidos"
          icon={UserPlus}
        />
      )}

      {isPlayer && <RatingsApproval />}

      {isPlayer && account.reviewRatings && (
        <LinkCard
          label={withCount('Avaliações pendentes', account.pendingRatingsCount)}
          href="/configuracoes-e-privacidade/privacidade/avaliacoes"
          icon={Star}
        />
      )}

      <nav className="space-y-2">
        {PRIVACY_ROUTES.map((route) => (
          <LinkCard key={route.href} {...route} />
        ))}
      </nav>
    </>
  );
}
