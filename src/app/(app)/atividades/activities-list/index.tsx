'use client';

import { useEffect } from 'react';
import { Shield, Star, UserCheck, Users } from 'lucide-react';
import { LinkCard } from '@/src/core/components/link-card';
import { AccountType } from '@/src/core/enums/account-type';
import { useAccount } from '@/src/core/providers/account';

const RATING_ACCOUNT_TYPES = [AccountType.PLAYER, AccountType.SCOUT];

export function ActivitiesList() {
  const { account, refreshAccount } = useAccount();

  useEffect(() => {
    refreshAccount().catch(() => undefined);
  }, [refreshAccount]);

  const hasRatings = Boolean(account?.type && RATING_ACCOUNT_TYPES.includes(account.type));

  return (
    <nav className="space-y-2">
      <LinkCard
        label={`Seguidores (${account?.followersCount ?? 0})`}
        href="/atividades/seguidores"
        icon={Users}
      />
      <LinkCard
        label={`Seguindo (${account?.followingCount ?? 0})`}
        href="/atividades/seguindo"
        icon={UserCheck}
      />
      {hasRatings && <LinkCard label="Avaliações" href="/atividades/avaliacoes" icon={Star} />}
      {hasRatings && <LinkCard label="Clube" href="/atividades/clube" icon={Shield} />}
    </nav>
  );
}
