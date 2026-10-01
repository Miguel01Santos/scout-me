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

    if (!session && !isLocalhost) {
      router.replace('/login');
      return;
    }

    // Sem sessão em localhost entra com o usuário de dev; o usuário sempre
    // chega por promise para não chamar setState direto no corpo do effect.
    const loadUser = session
      ? fetchLoggedUser(session.accessToken).then((response) => response.user)
      : Promise.resolve(LOCAL_DEV_USER);

    loadUser
      .then((loadedUser) => setUser(loadedUser))
      .catch(() => {
        clearSession();

        if (isLocalhost) {
          setUser(LOCAL_DEV_USER);
          return;
        }

        router.replace('/login');
      });
  }, [router]);

  return { user };
}
