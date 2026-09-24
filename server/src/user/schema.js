import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().trim().min(3, 'O nome precisa ter ao menos 3 caracteres').optional(),
  avatarUrl: z.url('URL inválida').nullish(),
});
