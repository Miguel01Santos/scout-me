'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, fetchLoggedUser, getSession } from '.';
import { AuthUser } from './type';

const LOCAL_DEV_USER: AuthUser = {
  id: 'local-dev',
  name: 'Dev Local',
  email: 'dev@localhost',
  createdAt: new Date().toISOString(),
};

export function useSession() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const session = getSession();

    if (!session) {
      if (isLocalhost) {
        setUser(LOCAL_DEV_USER);
        return;
      }

      router.replace('/login');
      return;
    }

    fetchLoggedUser(session.accessToken)
      .then((response) => setUser(response.user))
      .catch(() => {
        clearSession();

        if (isLocalhost) {
          setUser(LOCAL_DEV_USER);
          return;
        }

        router.replace('/login');
      });
  }, [router]);

  function logout() {
    clearSession();
    router.replace('/login');
  }

  return { user, logout };
}
