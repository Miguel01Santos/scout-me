import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toDisplayName } from '../account/mappers.js';
import { LINK_USERNAME_PLACEHOLDER, NOTIFICATIONS_LIMIT } from './constants.js';

const GENERATOR_SELECT = {
  username: true,
  profile: { select: { displayName: true, showDisplayName: true, avatarColor: true } },
  user: { select: { name: true, avatarUrl: true } },
};

function toNotificationGenerator(account) {
  return {
    username: account.username,
    name: toDisplayName(account),
    avatarUrl: account.user.avatarUrl ?? null,
    avatarColor: account.profile?.avatarColor ?? null,
  };
}

function resolveLink(link, generator) {
  if (!link) return null;

  return generator ? link.replace(LINK_USERNAME_PLACEHOLDER, generator.username) : link;
}

export async function createNotification(
  { userGeneratorNotification = null, userReceivesNotification, title },
  database = prismaClient
) {
  if (userGeneratorNotification === userReceivesNotification) return null;

  const data = {
    receiver: { connect: { id: userReceivesNotification } },
    template: { connect: { title } },
  };

  if (userGeneratorNotification) data.generator = { connect: { id: userGeneratorNotification } };

  return database.notification.create({ data });
}

export async function listNotifications(accountId) {
  const notifications = await prismaClient.notification.findMany({
    where: { userReceivesNotification: accountId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: NOTIFICATIONS_LIMIT,
    select: {
      id: true,
      createdAt: true,
      readAt: true,
      template: { select: { title: true, type: true, message: true, link: true } },
      generator: { select: GENERATOR_SELECT },
    },
  });

  return notifications.map(({ template, generator, ...notification }) => ({
    ...notification,
    title: template.title,
    type: template.type,
    message: template.message,
    link: resolveLink(template.link, generator),
    generator: generator ? toNotificationGenerator(generator) : null,
  }));
}

export async function countUnreadNotifications(accountId) {
  return prismaClient.notification.count({
    where: { userReceivesNotification: accountId, readAt: null },
  });
}

export async function markNotificationAsRead(accountId, notificationId) {
  const notification = await prismaClient.notification.findFirst({
    where: { id: notificationId, userReceivesNotification: accountId },
    select: { readAt: true },
  });

  if (!notification) throw new HttpError(404, 'Notificação não encontrada');
  if (notification.readAt) return;

  await prismaClient.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function deleteNotifications(accountId) {
  await prismaClient.notification.deleteMany({ where: { userReceivesNotification: accountId } });
}
