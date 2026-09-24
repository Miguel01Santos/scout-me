import { Router } from 'express';
import { me, update } from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';

export const userRouter = Router();

userRouter.get('/me', authenticate, me);
userRouter.patch('/me', authenticate, update);
