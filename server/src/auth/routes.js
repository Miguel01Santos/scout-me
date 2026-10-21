import { Router } from 'express';
import { env } from '../env.js';
import { requireLocalRequest } from '../middlewares/require-local-request.js';
import { register, login, refresh, logout, devLogin } from './controller.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

if (env.devLoginEnabled) {
  authRouter.post('/dev-login', requireLocalRequest, devLogin);
}
