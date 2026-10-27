import { z } from 'zod';
import { PlayerCategory, PlayerPosition, PreferredFoot } from '../player/constants.js';
import { PlayerLevel } from '../rating/constants.js';
import { ProfileSearchFilter, SEARCH_MIN_LENGTH } from './constants.js';

const PLAYER_FILTERS = ['position', 'preferredFoot', 'category', 'level'];

export const searchProfilesSchema = z
  .object({
    search: z
      .string('Digite o que quer buscar')
      .trim()
      .max(50, 'A busca pode ter no máximo 50 caracteres')
      .default(''),
    filter: z
      .enum(Object.values(ProfileSearchFilter), 'Filtro inválido')
      .default(ProfileSearchFilter.ALL),
    position: z.enum(Object.values(PlayerPosition), 'Posição inválida').optional(),
    preferredFoot: z.enum(Object.values(PreferredFoot), 'Pé dominante inválido').optional(),
    category: z.enum(Object.values(PlayerCategory), 'Categoria inválida').optional(),
    level: z.enum(Object.values(PlayerLevel), 'Nível inválido').optional(),
  })
  .superRefine((query, context) => {
    const hasPlayerFilters = PLAYER_FILTERS.some((key) => query[key]);

    if (!hasPlayerFilters && query.search.length < SEARCH_MIN_LENGTH) {
      context.addIssue({
        code: 'custom',
        path: ['search'],
        message: `Digite ao menos ${SEARCH_MIN_LENGTH} caracteres`,
      });
    }
  });
