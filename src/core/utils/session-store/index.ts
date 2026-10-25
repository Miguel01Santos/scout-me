import { AuthSession, SaveSessionOptions, SessionTokens } from '../../auth/type';
import { SESSION_STATE_COOKIE, SessionState } from '../../enums/session-state';
import { clearCachedTheme } from '../theme-cache';

const SESSION_KEY = 'scoutme.session';
// Mesma validade da sessão com "Lembre-me" na API.
const SESSION_STATE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

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
