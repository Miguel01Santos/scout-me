'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, ensureSession, fetchLoggedUser } from '.';
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

    async function loadUser(): Promise<AuthUser | null> {
      const session = await ensureSession();

      if (!session) return isLocalhost ? LOCAL_DEV_USER : null;

      try {
        return (await fetchLoggedUser(session.accessToken)).user;
      } catch {
        clearSession();

        const devSession = isLocalhost ? await ensureSession() : null;

        if (!devSession) return isLocalhost ? LOCAL_DEV_USER : null;

        return (await fetchLoggedUser(devSession.accessToken)).user;
      }
    }

    loadUser()
      .then((loadedUser) => {
        if (loadedUser) {
          setUser(loadedUser);
          return;
        }

        router.replace('/login');
      })
      .catch(() => {
        if (isLocalhost) {
          setUser(LOCAL_DEV_USER);
          return;
        }

        router.replace('/login');
      });
  }, [router]);

  return { user };
}
