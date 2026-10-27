import { z } from 'zod';

export const feedQuerySchema = z.object({
  before: z.coerce.date('Data inválida').optional(),
});
