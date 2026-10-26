'use client';

import { UserPlus } from 'lucide-react';
import { LinkCard } from '@/src/core/components/link-card';
import { useAccount } from '@/src/core/providers/account';
import { PRIVACY_ROUTES } from '../constants';

export function PrivacyList() {
  const { account } = useAccount();
  const requestsCount = account?.pendingFollowRequestsCount ?? 0;

  return (
    <nav className="space-y-2">
      <LinkCard
        label={requestsCount > 0 ? `Pedidos para seguir (${requestsCount})` : 'Pedidos para seguir'}
        href="/configuracoes-e-privacidade/privacidade/pedidos"
        icon={UserPlus}
      />
      {PRIVACY_ROUTES.map((route) => (
        <LinkCard key={route.href} {...route} />
      ))}
    </nav>
  );
}
