import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import {
  acceptAllFollowRequests,
  acceptFollowRequest,
  countFollows,
  declineFollowRequest,
  listFollowRequests,
} from '../follow/service.js';
import { AccountType, FREE_ACCOUNT_TYPES, USERNAME_PATTERN } from './constants.js';
import { toPublicConfiguration, toPublicPlayerAttributes, toPublicProfile } from './mappers.js';

const UNIQUE_CONSTRAINT_ERROR = 'P2002';
const USERNAME_TAKEN_MESSAGE = 'Esse nome de usuário já está em uso';

function usernameTakenError() {
  return new HttpError(409, USERNAME_TAKEN_MESSAGE, [
    { field: 'username', message: USERNAME_TAKEN_MESSAGE },
  ]);
}

export async function findAccountByUserId(userId) {
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

export async function findAccountByUsername(username) {
  const normalized = String(username).toLowerCase();
  const account = USERNAME_PATTERN.test(normalized)
    ? await prismaClient.account.findUnique({
        where: { username: normalized },
        include: {
          profile: true,
          playerAttributes: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      })
    : null;

  if (!account || !account.type) {
    throw new HttpError(404, 'Perfil não encontrado');
  }

  return account;
}

export async function getAccount(userId) {
  const account = await findAccountByUserId(userId);
  const [configuration, follows] = await Promise.all([
    prismaClient.configuration.upsert({
      where: { accountId: account.id },
      update: {},
      create: { accountId: account.id },
    }),
    countFollows(account.id),
  ]);

  return {
    id: account.id,
    username: account.username,
    type: account.type,
    isPrivate: account.isPrivate,
    configuration: toPublicConfiguration(configuration),
    profile: toPublicProfile(account.profile, account.user.avatarUrl),
    // Só existe para Player; nos outros tipos vem null.
    playerAttributes:
      account.type === AccountType.PLAYER ? toPublicPlayerAttributes(account.playerAttributes) : null,
    ...follows,
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

  await prismaClient.$transaction(async (transaction) => {
    await transaction.account.update({
      where: { id: account.id },
      data: { ...data, updatedAt: new Date() },
    });

    if (data.isPrivate === false) await acceptAllFollowRequests(account.id, transaction);
  });

  return getAccount(userId);
}

export async function updateProfile(userId, { username, ...profileData }) {
  const account = await findAccountByUserId(userId);
  const changesUsername = username !== undefined && username !== account.username;

  if (changesUsername) {
    const owner = await prismaClient.account.findUnique({ where: { username } });

    if (owner) throw usernameTakenError();
  }

  try {
    await prismaClient.$transaction(async (transaction) => {
      if (changesUsername) {
        await transaction.account.update({
          where: { id: account.id },
          data: { username, updatedAt: new Date() },
        });
      }

      await transaction.profile.upsert({
        where: { accountId: account.id },
        update: profileData,
        create: { accountId: account.id, ...profileData },
      });
    });
  } catch (error) {
    if (error.code === UNIQUE_CONSTRAINT_ERROR) throw usernameTakenError();

    throw error;
  }

  return getAccount(userId);
}

export async function getFollowRequests(userId) {
  const account = await findAccountByUserId(userId);

  return listFollowRequests(account.id);
}

export async function acceptFollowRequestFrom(userId, followerUsername) {
  const [account, follower] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(followerUsername),
  ]);

  await acceptFollowRequest(account.id, follower.id);

  return getAccount(userId);
}

export async function declineFollowRequestFrom(userId, followerUsername) {
  const [account, follower] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(followerUsername),
  ]);

  await declineFollowRequest(account.id, follower.id);

  return getAccount(userId);
}
