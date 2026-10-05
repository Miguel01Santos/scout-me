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
import {
  getAccount,
  updateAccount as saveAccount,
  updateProfile as saveProfile,
  updateConfiguration as saveConfiguration,
} from '../../api/account/service';
import { Account, UpdateAccountInput } from '../../api/account/type';
import { deleteAvatar, uploadAvatar } from '../../api/avatar/service';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { UpdateProfileInput } from '../../api/profile/type';
import { ensureSession, getSession } from '../../auth';
import { Language } from '../../enums/language';
import { Theme } from '../../enums/theme';
import {
  getCachedTheme,
  saveCachedTheme,
  subscribeToCachedTheme,
} from '../../utils/theme-cache';
import { AccountContextValue, AccountProviderProps } from './type';

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
    const loadAccount = ensureSession().then((session) =>
      session ? getAccount(session.accessToken).then((response) => response.account) : null
    );

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

  const updateAccount = useCallback(async (input: UpdateAccountInput) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveAccount(session.accessToken, input);

    setAccount(response.account);
  }, []);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveProfile(session.accessToken, input);

    setAccount(response.account);
  }, []);

  const refreshAccount = useCallback(async () => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await getAccount(session.accessToken);

    setAccount(response.account);
  }, []);

  const changeAvatar = useCallback(
    async (image: Blob) => {
      const session = getSession();

      if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

      await uploadAvatar(session.accessToken, image);
      await refreshAccount();
    },
    [refreshAccount]
  );

  const removeAvatar = useCallback(async () => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    await deleteAvatar(session.accessToken);
    await refreshAccount();
  }, [refreshAccount]);

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      configuration:
        account?.configuration ?? { ...DEFAULT_CONFIGURATION, theme: cachedTheme ?? DEFAULT_CONFIGURATION.theme },
      isLoading,
      updateConfiguration,
      updateAccount,
      updateProfile,
      changeAvatar,
      removeAvatar,
    }),
    [
      account,
      cachedTheme,
      isLoading,
      updateConfiguration,
      updateAccount,
      updateProfile,
      changeAvatar,
      removeAvatar,
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) throw new Error('useAccount precisa estar dentro de <AccountProvider>');

  return context;
}
