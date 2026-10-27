import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { rateLimitByUser } from '../middlewares/rate-limit.js';
import { create, remove, update, uploadSignatures } from './controller.js';

export const postRouter = Router();

const limitPostChange = rateLimitByUser({
  maxRequests: 60,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas alterações de posts em pouco tempo. Tente novamente em alguns minutos.',
});

postRouter.post('/signatures', authenticate, limitPostChange, uploadSignatures);
postRouter.post('/', authenticate, limitPostChange, create);
postRouter.patch('/:id', authenticate, limitPostChange, update);
postRouter.delete('/:id', authenticate, limitPostChange, remove);
