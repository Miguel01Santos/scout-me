import { findAccountByUserId } from '../account/service.js';
import { notificationParamsSchema } from './schema.js';
import { deleteNotifications, listNotifications, markNotificationAsRead } from './service.js';

export async function index(request, response) {
  const account = await findAccountByUserId(request.userId);
  const notifications = await listNotifications(account.id);

  return response.status(200).json({ notifications });
}

export async function read(request, response) {
  const { id } = notificationParamsSchema.parse(request.params);
  const account = await findAccountByUserId(request.userId);

  await markNotificationAsRead(account.id, id);

  return response.status(204).send();
}

export async function clear(request, response) {
  const account = await findAccountByUserId(request.userId);

  await deleteNotifications(account.id);

  return response.status(204).send();
}
