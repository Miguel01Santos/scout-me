import { z } from 'zod';
import { nameSchema } from '../user/schema.js';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'));
const rememberSchema = z.boolean('Valor inválido').default(true);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
  remember: rememberSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'A senha é obrigatória'),
  remember: rememberSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string('Token inválido').min(1, 'Token inválido'),
});
