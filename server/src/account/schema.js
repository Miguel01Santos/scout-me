import { z } from 'zod';
import { Language, Theme } from '../configuration/constants.js';

export const updateConfigurationSchema = z.object({
  theme: z.enum(Object.values(Theme), 'Tema inválido').optional(),
  language: z.enum(Object.values(Language), 'Idioma inválido').optional(),
  notifications: z.boolean('Valor inválido').optional(),
});

export const updateAccountSchema = z.object({
  isPrivate: z.boolean('Valor inválido'),
});
