import { get, post } from '../api';
import { clearSession, getSession, saveSession } from '../utils/session-store';
import { AuthSession, AuthUser, LoginInput, RegisterInput } from './type';

export { clearSession, getSession, saveSession };

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
