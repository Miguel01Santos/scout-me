'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccount } from '../api/account/service';
import { getSession } from '.';

// Login e cadastro são só para quem não entrou. Quem já tem sessão vai para o app,
// ou para a escolha do tipo de conta se ainda não terminou o cadastro.
export function useRedirectLoggedUser() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = getSession();
    const destination = session
      ? getAccount(session.accessToken).then(({ account }) =>
          account.type ? '/home' : '/tipo-de-conta'
        )
      : Promise.resolve(null);

    destination
      .then((path) => {
        if (path) {
          router.replace(path);
          return;
        }

        setIsChecking(false);
      })
      // Sessão inválida ou sem conexão: mostra o formulário para entrar de novo.
      .catch(() => setIsChecking(false));
  }, [router]);

  return { isChecking };
}
