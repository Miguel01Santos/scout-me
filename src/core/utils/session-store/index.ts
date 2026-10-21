import { AuthSession, SaveSessionOptions, SessionTokens } from '../../auth/type';
import { clearCachedTheme } from '../theme-cache';

const SESSION_KEY = 'scoutme.session';

function storageWithSession(): Storage | null {
  if (localStorage.getItem(SESSION_KEY)) return localStorage;
  if (sessionStorage.getItem(SESSION_KEY)) return sessionStorage;

  return null;
}

// Sem o "Lembre-me" a sessão vai para o sessionStorage e some quando o app é fechado.
export function saveSession(session: AuthSession, { remember = true }: SaveSessionOptions = {}) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
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

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  clearCachedTheme();
}
