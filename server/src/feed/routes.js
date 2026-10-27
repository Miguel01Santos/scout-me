import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { feed } from './controller.js';

export const feedRouter = Router();

feedRouter.get('/', authenticate, feed);
