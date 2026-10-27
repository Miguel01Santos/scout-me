import { get, post } from '../api';
import { Account } from '../api/account/type';
import { SessionState } from '../enums/session-state';
import {
  clearSession,
  getSession,
  keepActiveSession,
  listSavedSessions,
  removeSavedSession,
  restoreSavedSession,
  SAVED_SESSIONS_LIMIT,
  saveSession,
  saveSessionState,
} from '../utils/session-store';
import { AuthSession, AuthUser, LoginInput, RegisterInput, SavedSessionProfile } from './type';

export {
  clearSession,
  getSession,
  keepActiveSession as addAnotherAccount,
  listSavedSessions,
  restoreSavedSession,
  SAVED_SESSIONS_LIMIT,
  saveSession,
  saveSessionState,
};

// Primeira tela depois de entrar: a escolha do tipo, se o cadastro ainda não terminou.
export function landingPathFor(account: Account) {
  return account.type ? '/home' : '/tipo-de-conta';
}

// Deixa o cookie de navegação igual à conta, para o proxy.ts mandar para a tela certa.
export function syncSessionState(account: Account) {
  saveSessionState(account.type ? SessionState.READY : SessionState.PENDING_ACCOUNT_TYPE);
}

export function registerUser(input: RegisterInput) {
  return post<AuthSession>('/auth/register', input);
}

export function loginUser(input: LoginInput) {
  return post<AuthSession>('/auth/login', input);
}

export function fetchLoggedUser(accessToken: string) {
  return get<{ user: AuthUser }>('/user/me', accessToken);
}

// O aparelho sai da conta na hora; avisar a API para encerrar a sessão é só melhor esforço.
export function logoutUser() {
  const refreshToken = getSession()?.refreshToken;

  clearSession();

  if (refreshToken) post('/auth/logout', { refreshToken }).catch(() => undefined);
}

export function loginDevUser() {
  return post<AuthSession>('/auth/dev-login', {});
}

let devSessionRequest: Promise<AuthSession | null> | null = null;

export function ensureSession(): Promise<AuthSession | null> {
  const session = getSession();

  if (session) return Promise.resolve(session);
  if (window.location.hostname !== 'localhost') return Promise.resolve(null);

  devSessionRequest ??= loginDevUser()
    .then((devSession) => {
      saveSession(devSession);

      return devSession;
    })
    .catch(() => null)
    .finally(() => {
      devSessionRequest = null;
    });

  return devSessionRequest;
}

export function switchToSavedAccount(currentProfile: SavedSessionProfile | null, userId: string) {
  if (currentProfile) keepActiveSession(currentProfile);

  return restoreSavedSession(userId) !== null;
}

export function forgetSavedAccount(userId: string) {
  const refreshToken = removeSavedSession(userId)?.session.refreshToken;

  if (refreshToken) post('/auth/logout', { refreshToken }).catch(() => undefined);
}
