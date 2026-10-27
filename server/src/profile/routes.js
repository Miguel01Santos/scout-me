import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { rateLimitByUser } from '../middlewares/rate-limit.js';
import { invite, members, remove } from '../club/controller.js';
import { profileFollowers, profileFollowing } from '../follow/controller.js';
import { profilePosts } from '../post/controller.js';
import { askForRating, rate } from '../rating/controller.js';
import { follow, search, show, unfollow } from './controller.js';

export const profileRouter = Router();

const limitFollow = rateLimitByUser({
  maxRequests: 60,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas ações de seguir em pouco tempo. Tente novamente em alguns minutos.',
});

const limitSearch = rateLimitByUser({
  maxRequests: 300,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas buscas em pouco tempo. Tente novamente em alguns minutos.',
});

const limitRatingRequest = rateLimitByUser({
  maxRequests: 20,
  windowMs: 15 * 60 * 1000,
  message: 'Muitos pedidos de avaliação em pouco tempo. Tente novamente em alguns minutos.',
});

profileRouter.get('/', authenticate, limitSearch, search);
profileRouter.get('/:username', authenticate, show);
profileRouter.post('/:username/follow', authenticate, limitFollow, follow);
profileRouter.delete('/:username/follow', authenticate, limitFollow, unfollow);
profileRouter.post('/:username/ratings', authenticate, rate);
profileRouter.post('/:username/rating-requests', authenticate, limitRatingRequest, askForRating);
profileRouter.get('/:username/posts', authenticate, profilePosts);
profileRouter.get('/:username/followers', authenticate, profileFollowers);
profileRouter.get('/:username/following', authenticate, profileFollowing);
profileRouter.get('/:username/club-members', authenticate, members);
profileRouter.post('/:username/club-invite', authenticate, limitFollow, invite);
profileRouter.delete('/:username/club-member', authenticate, remove);
