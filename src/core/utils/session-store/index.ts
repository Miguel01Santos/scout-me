import {
  AuthSession,
  SavedSession,
  SavedSessionProfile,
  SaveSessionOptions,
  SessionTokens,
} from '../../auth/type';
import { SESSION_STATE_COOKIE, SessionState } from '../../enums/session-state';
import { clearCachedTheme } from '../theme-cache';

const SESSION_KEY = 'scoutme.session';
const SAVED_SESSIONS_KEY = 'scoutme.saved-sessions';
export const SAVED_SESSIONS_LIMIT = 4;
// Mesma validade da sessão com "Lembre-me" na API.
const SESSION_STATE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

function storageWithSession(): Storage | null {
  if (localStorage.getItem(SESSION_KEY)) return localStorage;
  if (sessionStorage.getItem(SESSION_KEY)) return sessionStorage;

  return null;
}

function readSavedSessions(storage: Storage): SavedSession[] {
  try {
    return JSON.parse(storage.getItem(SAVED_SESSIONS_KEY) ?? '[]') as SavedSession[];
  } catch {
    return [];
  }
}

function writeSavedSessions(storage: Storage, savedSessions: SavedSession[]) {
  if (savedSessions.length === 0) {
    storage.removeItem(SAVED_SESSIONS_KEY);
    return;
  }

  storage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(savedSessions));
}

export function removeSavedSession(userId: string): SavedSession | null {
  let removed: SavedSession | null = null;

  [localStorage, sessionStorage].forEach((storage) => {
    const savedSessions = readSavedSessions(storage);

    removed ??= savedSessions.find((saved) => saved.session.user.id === userId) ?? null;
    writeSavedSessions(
      storage,
      savedSessions.filter((saved) => saved.session.user.id !== userId)
    );
  });

  return removed;
}

// Sem o "Lembre-me" a sessão vai para o sessionStorage e some quando o app é fechado.
export function saveSession(session: AuthSession, { remember = true }: SaveSessionOptions = {}) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  removeSavedSession(session.user.id);
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
}

export function listSavedSessions(): SavedSession[] {
  return [...readSavedSessions(localStorage), ...readSavedSessions(sessionStorage)];
}

export function getSession(): AuthSession | null {
  const storedSession = storageWithSession()?.getItem(SESSION_KEY);

  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    return null;
  }
}

// Troca só os tokens, mantendo a sessão no mesmo storage em que o login a salvou.
export function updateSessionTokens(tokens: SessionTokens) {
  const storage = storageWithSession();
  const session = getSession();

  if (!storage || !session) return;

  storage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...tokens }));
}

// Acompanha o storage da sessão: com "Lembre-me" o cookie dura 90 dias; sem, some junto
// com o navegador, como o sessionStorage.
export function saveSessionState(state: SessionState) {
  const attributes = ['Path=/', 'SameSite=Lax'];

  if (localStorage.getItem(SESSION_KEY)) attributes.push(`Max-Age=${SESSION_STATE_MAX_AGE_SECONDS}`);
  if (window.location.protocol === 'https:') attributes.push('Secure');

  document.cookie = `${SESSION_STATE_COOKIE}=${state}; ${attributes.join('; ')}`;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  document.cookie = `${SESSION_STATE_COOKIE}=; Path=/; Max-Age=0`;
  clearCachedTheme();
}

export function keepActiveSession(profile: SavedSessionProfile) {
  const storage = storageWithSession();
  const session = getSession();

  if (!storage || !session) return;

  const others = readSavedSessions(storage).filter((saved) => saved.session.user.id !== session.user.id);

  writeSavedSessions(storage, [{ session, profile }, ...others].slice(0, SAVED_SESSIONS_LIMIT));
  clearSession();
}

export function restoreSavedSession(userId: string): SavedSession | null {
  const remember = readSavedSessions(localStorage).some((saved) => saved.session.user.id === userId);
  const saved = removeSavedSession(userId);

  if (!saved) return null;

  saveSession(saved.session, { remember });
  saveSessionState(saved.profile.accountType ? SessionState.READY : SessionState.PENDING_ACCOUNT_TYPE);

  return saved;
}
