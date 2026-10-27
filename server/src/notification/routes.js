import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { clear, index, read } from './controller.js';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate, index);
notificationRouter.delete('/', authenticate, clear);
notificationRouter.post('/:id/read', authenticate, read);
