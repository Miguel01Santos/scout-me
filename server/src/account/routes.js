import { Router } from 'express';
import {
  acceptRequest,
  declineRequest,
  followRequests,
  me,
  update,
  updateMe,
  updateMyPlayerAttributes,
  updateMyProfile,
  updateMyType,
} from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';

export const accountRouter = Router();

accountRouter.get('/me', authenticate, me);
accountRouter.patch('/me', authenticate, updateMe);
accountRouter.patch('/me/configuration', authenticate, update);
accountRouter.patch('/me/profile', authenticate, updateMyProfile);
accountRouter.put('/me/type', authenticate, updateMyType);
accountRouter.put('/me/player-attributes', authenticate, updateMyPlayerAttributes);
accountRouter.get('/me/follow-requests', authenticate, followRequests);
accountRouter.post('/me/follow-requests/:username', authenticate, acceptRequest);
accountRouter.delete('/me/follow-requests/:username', authenticate, declineRequest);
