import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { rateLimitByUser } from '../middlewares/rate-limit.js';
import { follow, search, show, unfollow } from './controller.js';

export const profileRouter = Router();

const limitFollow = rateLimitByUser({
  maxRequests: 60,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas ações de seguir em pouco tempo. Tente novamente em alguns minutos.',
});

const limitSearch = rateLimitByUser({
  maxRequests: 300,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas buscas em pouco tempo. Tente novamente em alguns minutos.',
});

profileRouter.get('/', authenticate, limitSearch, search);
profileRouter.get('/:username', authenticate, show);
profileRouter.post('/:username/follow', authenticate, limitFollow, follow);
profileRouter.delete('/:username/follow', authenticate, limitFollow, unfollow);
