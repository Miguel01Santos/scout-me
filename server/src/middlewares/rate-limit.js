import { HttpError } from '../http-error.js';

// Limitador em memória por usuário autenticado (usar depois do `authenticate`).
// Cada instância do servidor conta sozinha: em ambiente com várias instâncias/serverless
// o limite efetivo é por instância. Para um limite global, trocar por um store compartilhado.
export function rateLimitByUser({ maxRequests, windowMs, message }) {
  const attempts = new Map();

  return function rateLimit(request, response, next) {
    const now = Date.now();
    const entry = attempts.get(request.userId);

    if (!entry || entry.resetAt <= now) {
      attempts.set(request.userId, { count: 1, resetAt: now + windowMs });

      return next();
    }

    if (entry.count >= maxRequests) {
      response.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));

      throw new HttpError(429, message);
    }

    entry.count += 1;

    next();
  };
}
