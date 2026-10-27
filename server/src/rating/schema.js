import { z } from 'zod';
import { RATING_CRITERIA, RATING_MAX, RATING_MIN } from './constants.js';

const criterionSchema = z
  .number('Nota inválida')
  .int('Use uma nota inteira')
  .min(RATING_MIN, `A nota mínima é ${RATING_MIN}`)
  .max(RATING_MAX, `A nota máxima é ${RATING_MAX}`);

export const rateProfileSchema = z
  .object({
    isPrivate: z.boolean('Valor inválido').default(false),
    ...Object.fromEntries(RATING_CRITERIA.map((criterion) => [criterion, criterionSchema])),
  })
  .strict();

export const requestRatingSchema = z
  .object({
    isPrivate: z.boolean('Valor inválido').default(false),
  })
  .strict();

export const ratingParamsSchema = z.object({
  id: z.coerce.number('Avaliação inválida').int('Avaliação inválida').positive('Avaliação inválida'),
});
