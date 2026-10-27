import { z } from 'zod';
import { Language, Theme } from '../configuration/constants.js';
import { PlayerCategory, PlayerPosition, PreferredFoot } from '../player/constants.js';
import { AccountType, RESERVED_USERNAMES, USERNAME_PATTERN } from './constants.js';
import { AvatarColor, BIO_MAX_LENGTH } from '../profile/constants.js';
import { nameSchema } from '../user/schema.js';

export const usernameSchema = z
  .string('Usuário inválido')
  .trim()
  .toLowerCase()
  .pipe(
    z
      .string()
      .regex(USERNAME_PATTERN, 'Use de 3 a 30 caracteres: letras, números, ponto ou _, começando com letra')
      .refine((username) => !RESERVED_USERNAMES.includes(username), 'Esse nome de usuário não está disponível')
  );

export const updateConfigurationSchema = z.object({
  theme: z.enum(Object.values(Theme), 'Tema inválido').optional(),
  language: z.enum(Object.values(Language), 'Idioma inválido').optional(),
  notifications: z.boolean('Valor inválido').optional(),
});

export const chooseAccountTypeSchema = z.object({
  type: z.enum(Object.values(AccountType), 'Tipo de conta inválido'),
});

// PUT completo: os três campos vêm sempre (null limpa). O strict recusa campos a mais.
export const updatePlayerAttributesSchema = z
  .object({
    preferredFoot: z.enum(Object.values(PreferredFoot), 'Pé dominante inválido').nullable(),
    position: z.enum(Object.values(PlayerPosition), 'Posição inválida').nullable(),
    category: z.enum(Object.values(PlayerCategory), 'Categoria inválida').nullable(),
  })
  .strict();

export const updateAccountSchema = z
  .object({
    isPrivate: z.boolean('Valor inválido').optional(),
    reviewRatings: z.boolean('Valor inválido').optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'Informe o que quer alterar');

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  displayName: nameSchema.nullable().optional(),
  showDisplayName: z.boolean('Valor inválido').optional(),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `A descrição pode ter no máximo ${BIO_MAX_LENGTH} caracteres`)
    .nullable()
    .optional(),
  avatarColor: z.enum(Object.values(AvatarColor), 'Cor inválida').nullable().optional(),
});
