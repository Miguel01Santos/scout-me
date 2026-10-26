import { z } from 'zod';

export const searchProfilesSchema = z.object({
  search: z
    .string('Digite o que quer buscar')
    .trim()
    .min(2, 'Digite ao menos 2 caracteres')
    .max(50, 'A busca pode ter no máximo 50 caracteres'),
});
