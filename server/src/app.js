import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { authRouter } from './auth/routes.js';
import { userRouter } from './user/routes.js';
import { accountRouter } from './account/routes.js';
import { profileRouter } from './profile/routes.js';
import { notificationRouter } from './notification/routes.js';
import { recentSearchRouter } from './recent-search/routes.js';
import { postRouter } from './post/routes.js';
import { feedRouter } from './feed/routes.js';
import { scoutingRouter } from './scouting/routes.js';
import { ratingRouter } from './rating/routes.js';
import { errorHandler } from './middlewares/error-handler.js';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (request, response) => response.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/account', accountRouter);
app.use('/profiles', profileRouter);
app.use('/notifications', notificationRouter);
app.use('/recent-searches', recentSearchRouter);
app.use('/posts', postRouter);
app.use('/feed', feedRouter);
app.use('/scouting', scoutingRouter);
app.use('/ratings', ratingRouter);

app.use((request, response) => response.status(404).json({ message: 'Rota não encontrada' }));

app.use(errorHandler);

export default app;
