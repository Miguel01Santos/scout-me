import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { athletes } from './controller.js';

export const scoutingRouter = Router();

scoutingRouter.get('/athletes', authenticate, athletes);
