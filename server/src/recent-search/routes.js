import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { index, remove, save } from './controller.js';

export const recentSearchRouter = Router();

recentSearchRouter.get('/', authenticate, index);
recentSearchRouter.post('/:username', authenticate, save);
recentSearchRouter.delete('/:username', authenticate, remove);
