import { z } from 'zod';

export const notificationParamsSchema = z.object({
  id: z.coerce.number('Notificação inválida').int('Notificação inválida').positive('Notificação inválida'),
});
