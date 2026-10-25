import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { AccountType, FREE_ACCOUNT_TYPES } from './constants.js';

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

function toPublicPlayerAttributes(attributes) {
  return {
    preferredFoot: attributes?.preferredFoot ?? null,
    position: attributes?.position ?? null,
    category: attributes?.category ?? null,
  };
}

async function findAccountByUserId(userId) {
  const account = await prismaClient.account.findFirst({
    where: { userId },
    orderBy: { id: 'asc' },
    include: { profile: true, playerAttributes: true, user: { select: { avatarUrl: true } } },
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
    // Só existe para Player; nos outros tipos vem null.
    playerAttributes:
      account.type === AccountType.PLAYER ? toPublicPlayerAttributes(account.playerAttributes) : null,
  };
}

// O token decide de qual conta são os atributos (nada de id vindo do front), e só Player
// pode ter atributos, mesmo que outro tipo chame a rota direto.
export async function updatePlayerAttributes(userId, data) {
  const account = await findAccountByUserId(userId);

  if (account.type !== AccountType.PLAYER) {
    throw new HttpError(403, 'Atributos são exclusivos de contas Player');
  }

  await prismaClient.playerAttributes.upsert({
    where: { accountId: account.id },
    update: { ...data, updatedAt: new Date() },
    create: { accountId: account.id, ...data },
  });

  return getAccount(userId);
}

// A escolha acontece uma vez, logo depois do cadastro; trocar de tipo depois é outro fluxo.
export async function chooseAccountType(userId, { type }) {
  const account = await findAccountByUserId(userId);

  if (account.type) {
    throw new HttpError(409, 'O tipo da conta já foi escolhido');
  }

  if (!FREE_ACCOUNT_TYPES.includes(type)) {
    throw new HttpError(403, 'Esse tipo de conta é pago e ainda não está disponível');
  }

  // O filtro por tipo vazio impede que dois pedidos ao mesmo tempo gravem tipos diferentes.
  const { count } = await prismaClient.account.updateMany({
    where: { id: account.id, type: null },
    data: { type, updatedAt: new Date() },
  });

  if (count === 0) {
    throw new HttpError(409, 'O tipo da conta já foi escolhido');
  }

  return getAccount(userId);
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
