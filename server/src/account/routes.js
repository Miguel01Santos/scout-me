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
import { acceptInvite, declineInvite, leave, myClub } from '../club/controller.js';
import { followers, following } from '../follow/controller.js';
import { friends } from '../post/controller.js';
import {
  cancelRating,
  givenRatings,
  hideRating,
  pendingRatings,
  privateRatings,
  publishRating,
  receivedRatings,
} from '../rating/controller.js';

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
accountRouter.get('/me/private-ratings', authenticate, privateRatings);
accountRouter.get('/me/pending-ratings', authenticate, pendingRatings);
accountRouter.post('/me/pending-ratings/:username', authenticate, publishRating);
accountRouter.delete('/me/pending-ratings/:username', authenticate, hideRating);
accountRouter.get('/me/friends', authenticate, friends);
accountRouter.get('/me/followers', authenticate, followers);
accountRouter.get('/me/following', authenticate, following);
accountRouter.get('/me/ratings/received', authenticate, receivedRatings);
accountRouter.get('/me/ratings/given', authenticate, givenRatings);
accountRouter.delete('/me/ratings/given/:id', authenticate, cancelRating);
accountRouter.get('/me/club', authenticate, myClub);
accountRouter.post('/me/club-invites/:username', authenticate, acceptInvite);
accountRouter.delete('/me/club-invites/:username', authenticate, declineInvite);
accountRouter.delete('/me/club', authenticate, leave);
