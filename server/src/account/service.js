import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';

function toPublicConfiguration(configuration) {
  return {
    theme: configuration.theme,
    language: configuration.language,
    notifications: configuration.notifications,
  };
}

function toPublicProfile(profile, avatarUrl) {
  return {
    avatarUrl: avatarUrl ?? null,
    displayName: profile?.displayName ?? null,
    showDisplayName: profile?.showDisplayName ?? true,
    bio: profile?.bio ?? null,
    avatarColor: profile?.avatarColor ?? null,
  };
}

async function findAccountByUserId(userId) {
  const account = await prismaClient.account.findFirst({
    where: { userId },
    orderBy: { id: 'asc' },
    include: { profile: true, user: { select: { avatarUrl: true } } },
  });

  if (!account) {
    throw new HttpError(404, 'Conta não encontrada');
  }

  return account;
}

export async function getAccount(userId) {
  const account = await findAccountByUserId(userId);
  const configuration = await prismaClient.configuration.upsert({
    where: { accountId: account.id },
    update: {},
    create: { accountId: account.id },
  });

  return {
    id: account.id,
    type: account.type,
    isPrivate: account.isPrivate,
    configuration: toPublicConfiguration(configuration),
    profile: toPublicProfile(account.profile, account.user.avatarUrl),
  };
}

export async function updateConfiguration(userId, data) {
  const account = await findAccountByUserId(userId);

  await prismaClient.configuration.upsert({
    where: { accountId: account.id },
    update: data,
    create: { accountId: account.id, ...data },
  });

  return getAccount(userId);
}

export async function updateAccount(userId, data) {
  const account = await findAccountByUserId(userId);

  await prismaClient.account.update({
    where: { id: account.id },
    data: { ...data, updatedAt: new Date() },
  });

  return getAccount(userId);
}

export async function updateProfile(userId, data) {
  const account = await findAccountByUserId(userId);

  await prismaClient.profile.upsert({
    where: { accountId: account.id },
    update: data,
    create: { accountId: account.id, ...data },
  });

  return getAccount(userId);
}
