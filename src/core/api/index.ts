import { SessionTokens } from '../auth/type';
import { clearSession, getSession, updateSessionTokens } from '../utils/session-store';
import { ApiErrorBody, ApiIssue } from './type';

const API_URL = '/api';
const REFRESH_LOCK_NAME = 'scoutme.refresh-session';

export class ApiError extends Error {
  readonly issues: ApiIssue[];

  constructor(message: string, issues: ApiIssue[] = []) {
    super(message);
    this.name = 'ApiError';
    this.issues = issues;
  }
}

async function send(path: string, init: RequestInit, accessToken?: string) {
  const headers = new Headers(init.headers);

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  try {
    return await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Não foi possível falar com o servidor. Ele está rodando?');
  }
}

async function requestNewTokens(refreshToken: string): Promise<string | null> {
  let response: Response;

  try {
    response = await send('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return null;
  }

  if (response.status === 401) {
    clearSession();
    return null;
  }

  if (!response.ok) return null;

  const tokens = (await response.json()) as SessionTokens;

  updateSessionTokens(tokens);

  return tokens.accessToken;
}

// O lock faz as abas abertas renovarem uma de cada vez: a segunda encontra o token novo e só reaproveita.
async function withRefreshLock<T>(callback: () => Promise<T>): Promise<T> {
  if (!navigator.locks) return callback();

  return await navigator.locks.request(REFRESH_LOCK_NAME, callback);
}

let refreshRequest: Promise<string | null> | null = null;

// Várias chamadas podem receber 401 ao mesmo tempo; todas esperam a mesma renovação.
function refreshAccessToken(expiredAccessToken: string): Promise<string | null> {
  refreshRequest ??= withRefreshLock(async () => {
    const session = getSession();

    if (!session?.refreshToken) return null;
    if (session.accessToken !== expiredAccessToken) return session.accessToken;

    return requestNewTokens(session.refreshToken);
  }).finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

async function request<TResponse>(
  path: string,
  init: RequestInit,
  accessToken?: string
): Promise<TResponse> {
  let response = await send(path, init, accessToken);

  if (response.status === 401 && accessToken) {
    const newAccessToken = await refreshAccessToken(accessToken);

    if (newAccessToken) response = await send(path, init, newAccessToken);
  }

  const data = (await response.json().catch(() => null)) as
    | (TResponse & ApiErrorBody)
    | null;

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Erro inesperado', data?.issues ?? []);
  }

  return data as TResponse;
}

export function post<TResponse>(path: string, body: unknown) {
  return request<TResponse>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function get<TResponse>(path: string, accessToken: string) {
  return request<TResponse>(path, { method: 'GET' }, accessToken);
}

export function patch<TResponse>(path: string, accessToken: string, body: unknown) {
  return request<TResponse>(
    path,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export function postAuthenticated<TResponse>(path: string, accessToken: string) {
  return request<TResponse>(path, { method: 'POST' }, accessToken);
}

export function put<TResponse>(path: string, accessToken: string, body: unknown) {
  return request<TResponse>(
    path,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export function del<TResponse>(path: string, accessToken: string) {
  return request<TResponse>(path, { method: 'DELETE' }, accessToken);
}
