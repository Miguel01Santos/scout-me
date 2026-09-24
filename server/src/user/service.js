import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function findUserById(userId) {
  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado');
  }

  return toPublicUser(user);
}

export async function updateUser(userId, data) {
  await findUserById(userId);

  const user = await prismaClient.user.update({ where: { id: userId }, data });

  return toPublicUser(user);
}
