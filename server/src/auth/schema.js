import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'));

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'O nome precisa ter ao menos 3 caracteres'),
  email: emailSchema,
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'A senha é obrigatória'),
});
