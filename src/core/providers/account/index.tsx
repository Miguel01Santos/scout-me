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
import { useRouter } from 'next/navigation';
import {
  acceptFollowRequest as saveFollowRequestAcceptance,
  declineFollowRequest as saveFollowRequestDecline,
  getAccount,
  hidePendingRating as saveRatingRemoval,
  publishPendingRating as saveRatingPublication,
  updateAccount as saveAccount,
  updatePlayerAttributes as savePlayerAttributes,
  updateProfile as saveProfile,
  updateConfiguration as saveConfiguration,
} from '../../api/account/service';
import { Account, UpdateAccountInput } from '../../api/account/type';
import { deleteAvatar, uploadAvatar } from '../../api/avatar/service';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { UpdatePlayerAttributesInput } from '../../api/player-attributes/type';
import { UpdateProfileInput } from '../../api/profile/type';
import { clearSession, ensureSession, getSession, syncSessionState } from '../../auth';
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
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cachedTheme = useSyncExternalStore(subscribeToCachedTheme, getCachedTheme, () => null);

  useEffect(() => {
    ensureSession()
      .then(async (session) => {
        // Sem sessão o app nem aparece: vai direto para o login, sem mostrar a home antes.
        // O clearSession apaga um cookie de navegação que tenha sobrado.
        if (!session) {
          clearSession();
          router.replace('/login');
          return;
        }

        setIsAuthenticated(true);

        const { account: loadedAccount } = await getAccount(session.accessToken);

        // Também cobre quem já estava logado antes de o cookie existir.
        syncSessionState(loadedAccount);

        // Conta sem tipo ainda não terminou o cadastro. O loading continua para a tela não piscar.
        if (!loadedAccount.type) {
          router.replace('/tipo-de-conta');
          return;
        }

        setAccount(loadedAccount);
        setIsLoading(false);

        if (loadedAccount.configuration) saveCachedTheme(loadedAccount.configuration.theme);
      })
      .catch(() => {
        // A renovação do token falhou e a sessão foi apagada: volta para o login.
        if (!getSession()) {
          clearSession();
          router.replace('/login');
          return;
        }

        setAccount(null);
        setIsLoading(false);
      });
  }, [router]);

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

  const updatePlayerAttributes = useCallback(async (input: UpdatePlayerAttributesInput) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await savePlayerAttributes(session.accessToken, input);

    setAccount(response.account);
  }, []);

  const acceptFollowRequest = useCallback(async (username: string) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveFollowRequestAcceptance(session.accessToken, username);

    setAccount(response.account);
  }, []);

  const declineFollowRequest = useCallback(async (username: string) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveFollowRequestDecline(session.accessToken, username);

    setAccount(response.account);
  }, []);

  const publishPendingRating = useCallback(async (username: string) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveRatingPublication(session.accessToken, username);

    setAccount(response.account);
  }, []);

  const hidePendingRating = useCallback(async (username: string) => {
    const session = getSession();

    if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

    const response = await saveRatingRemoval(session.accessToken, username);

    setAccount(response.account);
  }, []);

  const setUnreadNotificationsCount = useCallback((count: number) => {
    setAccount((current) => (current ? { ...current, unreadNotificationsCount: count } : current));
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
      isAuthenticated,
      updateConfiguration,
      updateAccount,
      updateProfile,
      updatePlayerAttributes,
      acceptFollowRequest,
      declineFollowRequest,
      publishPendingRating,
      hidePendingRating,
      setUnreadNotificationsCount,
      refreshAccount,
      changeAvatar,
      removeAvatar,
    }),
    [
      account,
      cachedTheme,
      isLoading,
      isAuthenticated,
      updateConfiguration,
      updateAccount,
      updateProfile,
      updatePlayerAttributes,
      acceptFollowRequest,
      declineFollowRequest,
      publishPendingRating,
      hidePendingRating,
      setUnreadNotificationsCount,
      refreshAccount,
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
