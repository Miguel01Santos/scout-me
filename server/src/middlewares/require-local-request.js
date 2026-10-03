import { HttpError } from '../http-error.js';

const LOOPBACK_ADDRESSES = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

export function requireLocalRequest(request, response, next) {
  const isForwarded = Boolean(request.headers['x-forwarded-for'] || request.headers.forwarded);
  const isLoopback = LOOPBACK_ADDRESSES.includes(request.socket.remoteAddress);

  if (isForwarded || !isLoopback) {
    throw new HttpError(404, 'Rota não encontrada');
  }

  next();
}
