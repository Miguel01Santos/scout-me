import { Router } from 'express';
import { me, update, updateMe } from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';

export const accountRouter = Router();

accountRouter.get('/me', authenticate, me);
accountRouter.patch('/me', authenticate, updateMe);
accountRouter.patch('/me/configuration', authenticate, update);
