'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/src/core/api';
import { getFollowRequests } from '@/src/core/api/account/service';
import { FollowRequest } from '@/src/core/api/profiles/type';
import { getSession } from '@/src/core/auth';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { FollowRequestRow } from '../follow-request-row';
import { FollowRequestsSkeleton } from '../follow-requests-skeleton';

export function FollowRequestsList() {
  const { acceptFollowRequest, declineFollowRequest } = useAccount();
  const themeClasses = useThemeClasses();
  const [requests, setRequests] = useState<FollowRequest[] | null>(null);
  const [busyUsername, setBusyUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getFollowRequests(session.accessToken)
      .then(({ requests: loadedRequests }) => setRequests(loadedRequests))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiError ? error.message : 'Não foi possível carregar os pedidos.'
        );
        setRequests([]);
      });
  }, []);

  async function answer(username: string, accept: boolean) {
    setErrorMessage('');
    setBusyUsername(username);

    try {
      await (accept ? acceptFollowRequest : declineFollowRequest)(username);
      setRequests((current) => current?.filter((request) => request.username !== username) ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setBusyUsername(null);
    }
  }

  if (!requests) return <FollowRequestsSkeleton />;

  return (
    <section className="space-y-3">
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {requests.length === 0 ? (
        <p className={`text-sm italic ${themeClasses.subText}`}>Nenhum pedido no momento.</p>
      ) : (
        requests.map((request) => (
          <FollowRequestRow
            key={request.username}
            request={request}
            isBusy={busyUsername === request.username}
            onAccept={() => answer(request.username, true)}
            onDecline={() => answer(request.username, false)}
          />
        ))
      )}
    </section>
  );
}
