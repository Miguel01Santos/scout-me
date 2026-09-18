import jsonwebtoken from 'jsonwebtoken';
import { env } from '../env.js';
import { HttpError } from '../http-error.js';

const BEARER_PREFIX = 'Bearer ';

export function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    throw new HttpError(401, 'Token de acesso não informado');
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length);
  let payload;

  try {
    payload = jsonwebtoken.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, 'Token de acesso inválido ou expirado');
  }

  request.userId = payload.sub;

  next();
}
