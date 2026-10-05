import { Router } from 'express';
import {
  avatarUploadSignature,
  deleteAvatar,
  me,
  update,
  updateAvatar,
  updatePassword,
} from './controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { rateLimitByUser } from '../middlewares/rate-limit.js';

export const userRouter = Router();

const PASSWORD_CHANGE_WINDOW_MS = 15 * 60 * 1000;
const PASSWORD_CHANGE_MAX_ATTEMPTS = 5;

const limitPasswordChange = rateLimitByUser({
  maxRequests: PASSWORD_CHANGE_MAX_ATTEMPTS,
  windowMs: PASSWORD_CHANGE_WINDOW_MS,
  message: 'Muitas tentativas de troca de senha. Tente novamente em alguns minutos.',
});

const limitAvatarChange = rateLimitByUser({
  maxRequests: 20,
  windowMs: 15 * 60 * 1000,
  message: 'Muitas alterações de foto. Tente novamente em alguns minutos.',
});

userRouter.get('/me', authenticate, me);
userRouter.patch('/me', authenticate, update);
userRouter.patch('/me/password', authenticate, limitPasswordChange, updatePassword);
userRouter.post('/me/avatar/signature', authenticate, limitAvatarChange, avatarUploadSignature);
userRouter.put('/me/avatar', authenticate, limitAvatarChange, updateAvatar);
userRouter.delete('/me/avatar', authenticate, limitAvatarChange, deleteAvatar);
