import { z } from 'zod';

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 25;

// Os espaços contam no tamanho. Mantenha em sincronia com src/core/utils/validate-name no front.
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
