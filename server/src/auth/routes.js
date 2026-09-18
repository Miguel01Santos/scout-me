import { Router } from 'express';
import { register, login, me } from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authenticate, me);
