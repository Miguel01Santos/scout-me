import { z } from 'zod';
import { nameSchema } from '../user/schema.js';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'));

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'A senha é obrigatória'),
});
