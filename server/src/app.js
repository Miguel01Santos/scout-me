import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { authRouter } from './auth/routes.js';
import { errorHandler } from './middlewares/error-handler.js';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (request, response) => response.json({ status: 'ok' }));

app.use('/auth', authRouter);

app.use((request, response) => response.status(404).json({ message: 'Rota não encontrada' }));

app.use(errorHandler);

export default app;
