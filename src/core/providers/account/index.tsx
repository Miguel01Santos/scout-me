'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAccount, updateConfiguration as saveConfiguration } from '../../api/account/service';
import { Account } from '../../api/account/type';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { getSession } from '../../auth';
import { Language } from '../../enums/language';
import { Theme } from '../../enums/theme';
import { AccountContextValue, AccountProviderProps } from './type';

// Aplicado enquanto a conta não chega (ou quando não há sessão, como em dev local).
export const DEFAULT_CONFIGURATION: Configuration = {
  theme: Theme.DARK,
  language: Language.PT,
  notifications: true,
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: AccountProviderProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    const loadAccount = session
      ? getAccount(session.accessToken).then((response) => response.account)
      : Promise.resolve(null);

    loadAccount
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setIsLoading(false));
  }, []);

  const updateConfiguration = useCallback(async (input: UpdateConfigurationInput) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveConfiguration(session.accessToken, input);

    setAccount(response.account);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      configuration: account?.configuration ?? DEFAULT_CONFIGURATION,
      isLoading,
      updateConfiguration,
    }),
    [account, isLoading, updateConfiguration]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) throw new Error('useAccount precisa estar dentro de <AccountProvider>');

  return context;
}
