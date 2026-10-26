import { z } from 'zod';
import { ProfileSearchFilter } from './constants.js';

export const searchProfilesSchema = z.object({
  search: z
    .string('Digite o que quer buscar')
    .trim()
    .min(2, 'Digite ao menos 2 caracteres')
    .max(50, 'A busca pode ter no máximo 50 caracteres'),
  filter: z
    .enum(Object.values(ProfileSearchFilter), 'Filtro inválido')
    .default(ProfileSearchFilter.ALL),
});
