import { z } from 'zod';

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 25;

export const nameSchema = z.string().superRefine((name, context) => {
  let message;

  if (name.length === 0) message = 'O nome não pode ficar vazio';
  else if (name.startsWith(' ')) message = 'O nome não pode começar com espaço';
  else if (name.length < NAME_MIN_LENGTH) {
    message = `O nome precisa ter ao menos ${NAME_MIN_LENGTH} caracteres`;
  } else if (name.length > NAME_MAX_LENGTH) {
    message = `O nome pode ter no máximo ${NAME_MAX_LENGTH} caracteres`;
  }

  if (message) context.addIssue({ code: 'custom', message });
});

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  avatarUrl: z.url('URL inválida').nullish(),
});

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `A nova senha precisa ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`)
      .max(PASSWORD_MAX_LENGTH, `A nova senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres`),
  })
  .strict();
