import { z } from 'zod';
import { Language, Theme } from '../configuration/constants.js';
import { AvatarColor, BIO_MAX_LENGTH } from '../profile/constants.js';
import { nameSchema } from '../user/schema.js';

export const updateConfigurationSchema = z.object({
  theme: z.enum(Object.values(Theme), 'Tema inválido').optional(),
  language: z.enum(Object.values(Language), 'Idioma inválido').optional(),
  notifications: z.boolean('Valor inválido').optional(),
});

export const updateAccountSchema = z.object({
  isPrivate: z.boolean('Valor inválido'),
});

export const updateProfileSchema = z.object({
  displayName: nameSchema.nullable().optional(),
  showDisplayName: z.boolean('Valor inválido').optional(),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `A descrição pode ter no máximo ${BIO_MAX_LENGTH} caracteres`)
    .nullable()
    .optional(),
  avatarColor: z.enum(Object.values(AvatarColor), 'Cor inválida').nullable().optional(),
});
