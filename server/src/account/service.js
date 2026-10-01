import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';

function toPublicConfiguration(configuration) {
  return {
    theme: configuration.theme,
    language: configuration.language,
    notifications: configuration.notifications,
  };
}

async function findAccountByUserId(userId) {
  const account = await prismaClient.account.findFirst({
    where: { userId },
    orderBy: { id: 'asc' },
  });

  if (!account) {
    throw new HttpError(404, 'Conta não encontrada');
  }

  return account;
}

function toPublicAccount(account, configuration) {
  return {
    id: account.id,
    type: account.type,
    configuration: toPublicConfiguration(configuration),
  };
}

export async function getAccount(userId) {
  const account = await findAccountByUserId(userId);
  const configuration = await prismaClient.configuration.upsert({
    where: { accountId: account.id },
    update: {},
    create: { accountId: account.id },
  });

  return toPublicAccount(account, configuration);
}

export async function updateConfiguration(userId, data) {
  const account = await findAccountByUserId(userId);
  const configuration = await prismaClient.configuration.upsert({
    where: { accountId: account.id },
    update: data,
    create: { accountId: account.id, ...data },
  });

  return toPublicAccount(account, configuration);
}
