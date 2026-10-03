import { get, post } from '../api';
import { clearCachedTheme } from '../utils/theme-cache';
import { AuthSession, AuthUser, LoginInput, RegisterInput } from './type';

const SESSION_KEY = 'scoutme.session';

export function registerUser(input: RegisterInput) {
  return post<AuthSession>('/auth/register', input);
}

export function loginUser(input: LoginInput) {
  return post<AuthSession>('/auth/login', input);
}

export function fetchLoggedUser(accessToken: string) {
  return get<{ user: AuthUser }>('/user/me', accessToken);
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const storedSession = localStorage.getItem(SESSION_KEY);

  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  clearCachedTheme();
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
