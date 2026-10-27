import { z } from 'zod';
import {
  DESCRIPTION_MAX_LENGTH,
  MENTIONS_LIMIT,
  PHOTOS_PER_POST_LIMIT,
  POSTS_LIMIT,
} from './constants.js';

const positionSchema = z
  .number('Posição inválida')
  .int('Posição inválida')
  .min(1, 'Posição inválida')
  .max(POSTS_LIMIT, 'Posição inválida');

const descriptionSchema = z
  .string('Descrição inválida')
  .trim()
  .max(DESCRIPTION_MAX_LENGTH, `A descrição pode ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres`)
  .nullable()
  .transform((description) => description || null);

const mentionsSchema = z
  .array(z.string('Menção inválida').trim().toLowerCase())
  .max(MENTIONS_LIMIT, `Você pode mencionar no máximo ${MENTIONS_LIMIT} pessoas`)
  .transform((usernames) => [...new Set(usernames)]);

export const createPostSchema = z
  .object({
    position: positionSchema,
    description: descriptionSchema.default(null),
    photos: z
      .array(z.string('Foto inválida'))
      .min(1, 'Escolha pelo menos uma foto')
      .max(PHOTOS_PER_POST_LIMIT, `Um post pode ter no máximo ${PHOTOS_PER_POST_LIMIT} fotos`),
    mentions: mentionsSchema.default([]),
  })
  .strict();

export const updatePostSchema = z
  .object({
    position: positionSchema.optional(),
    description: descriptionSchema.optional(),
    mentions: mentionsSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'Informe o que quer alterar');

export const postParamsSchema = z.object({
  id: z.coerce.number('Post inválido').int('Post inválido').positive('Post inválido'),
});

export const postSignaturesSchema = z
  .object({
    count: z
      .number('Quantidade inválida')
      .int('Quantidade inválida')
      .min(1, 'Quantidade inválida')
      .max(PHOTOS_PER_POST_LIMIT, `Um post pode ter no máximo ${PHOTOS_PER_POST_LIMIT} fotos`),
  })
  .strict();
