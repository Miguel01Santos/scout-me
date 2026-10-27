import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { show } from './controller.js';

export const ratingRouter = Router();

ratingRouter.get('/:id', authenticate, show);
