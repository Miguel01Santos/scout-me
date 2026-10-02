import { Router } from 'express';
import { me, update, updatePassword } from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { rateLimitByUser } from '../middlewares/rate-limit.js';

export const userRouter = Router();

const PASSWORD_CHANGE_WINDOW_MS = 15 * 60 * 1000;
const PASSWORD_CHANGE_MAX_ATTEMPTS = 5;

const limitPasswordChange = rateLimitByUser({
  maxRequests: PASSWORD_CHANGE_MAX_ATTEMPTS,
  windowMs: PASSWORD_CHANGE_WINDOW_MS,
  message: 'Muitas tentativas de troca de senha. Tente novamente em alguns minutos.',
});

userRouter.get('/me', authenticate, me);
userRouter.patch('/me', authenticate, update);
userRouter.patch('/me/password', authenticate, limitPasswordChange, updatePassword);
