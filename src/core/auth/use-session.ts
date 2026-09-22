'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, fetchLoggedUser, getSession } from '.';
import { AuthUser } from './type';

export function useSession() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    fetchLoggedUser(session.accessToken)
      .then((response) => setUser(response.user))
      .catch(() => {
        clearSession();
        router.replace('/login');
      });
  }, [router]);

  function logout() {
    clearSession();
    router.replace('/login');
  }

  return { user, logout };
}
