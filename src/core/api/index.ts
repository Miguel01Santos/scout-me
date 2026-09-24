import { ApiErrorBody, ApiIssue } from './type';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export class ApiError extends Error {
  readonly issues: ApiIssue[];

  constructor(message: string, issues: ApiIssue[] = []) {
    super(message);
    this.name = 'ApiError';
    this.issues = issues;
  }
}

async function request<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError('Não foi possível falar com o servidor. Ele está rodando?');
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
  return request<TResponse>(path, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function patch<TResponse>(path: string, accessToken: string, body: unknown) {
  return request<TResponse>(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}
