import bcryptjs from 'bcryptjs';
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

const PASSWORD_SALT_ROUNDS = 10;

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado');
  }

  const currentPasswordMatches = await bcryptjs.compare(currentPassword, user.password);

  if (!currentPasswordMatches) {
    throw new HttpError(400, 'A senha atual está incorreta');
  }

  if (currentPassword === newPassword) {
    throw new HttpError(400, 'A nova senha precisa ser diferente da atual');
  }

  const hashedPassword = await bcryptjs.hash(newPassword, PASSWORD_SALT_ROUNDS);

  await prismaClient.user.update({ where: { id: userId }, data: { password: hashedPassword } });
}
