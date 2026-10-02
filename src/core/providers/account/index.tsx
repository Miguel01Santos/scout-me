'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { getAccount, updateConfiguration as saveConfiguration } from '../../api/account/service';
import { Account } from '../../api/account/type';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { getSession } from '../../auth';
import { Language } from '../../enums/language';
import { Theme } from '../../enums/theme';
import {
  getCachedTheme,
  saveCachedTheme,
  subscribeToCachedTheme,
} from '../../utils/theme-cache';
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
  const cachedTheme = useSyncExternalStore(subscribeToCachedTheme, getCachedTheme, () => null);

  useEffect(() => {
    const session = getSession();
    const loadAccount = session
      ? getAccount(session.accessToken).then((response) => response.account)
      : Promise.resolve(null);

    loadAccount
      .then((loadedAccount) => {
        setAccount(loadedAccount);

        if (loadedAccount?.configuration) saveCachedTheme(loadedAccount.configuration.theme);
      })
      .catch(() => setAccount(null))
      .finally(() => setIsLoading(false));
  }, []);

  const updateConfiguration = useCallback(async (input: UpdateConfigurationInput) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveConfiguration(session.accessToken, input);

    setAccount(response.account);

    if (response.account.configuration) saveCachedTheme(response.account.configuration.theme);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      configuration:
        account?.configuration ?? { ...DEFAULT_CONFIGURATION, theme: cachedTheme ?? DEFAULT_CONFIGURATION.theme },
      isLoading,
      updateConfiguration,
    }),
    [account, cachedTheme, isLoading, updateConfiguration]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) throw new Error('useAccount precisa estar dentro de <AccountProvider>');

  return context;
}
