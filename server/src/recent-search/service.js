import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toProfileCard } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { RECENT_SEARCHES_LIMIT } from './constants.js';

export async function listRecentSearches(userId) {
  const account = await findAccountByUserId(userId);
  const searches = await prismaClient.recentSearch.findMany({
    where: { accountId: account.id, searchedAccount: { type: { not: null } } },
    orderBy: { searchedAt: 'desc' },
    take: RECENT_SEARCHES_LIMIT,
    include: { searchedAccount: { include: PROFILE_CARD_INCLUDE } },
  });

  return searches.map(({ searchedAccount, searchedAt }) => ({
    ...toProfileCard(searchedAccount),
    searchedAt,
  }));
}

export async function saveRecentSearch(userId, username) {
  const [account, searchedAccount] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(username),
  ]);

  if (account.id === searchedAccount.id) {
    throw new HttpError(400, 'O próprio perfil não entra nas pesquisas recentes');
  }

  await prismaClient.$transaction(async (transaction) => {
    await transaction.recentSearch.upsert({
      where: {
        accountId_searchedAccountId: { accountId: account.id, searchedAccountId: searchedAccount.id },
      },
      update: { searchedAt: new Date() },
      create: { accountId: account.id, searchedAccountId: searchedAccount.id },
    });

    const overflow = await transaction.recentSearch.findMany({
      where: { accountId: account.id },
      orderBy: { searchedAt: 'desc' },
      skip: RECENT_SEARCHES_LIMIT,
      select: { searchedAccountId: true },
    });

    if (overflow.length === 0) return;

    await transaction.recentSearch.deleteMany({
      where: {
        accountId: account.id,
        searchedAccountId: { in: overflow.map((search) => search.searchedAccountId) },
      },
    });
  });
}

export async function removeRecentSearch(userId, username) {
  const [account, searchedAccount] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(username),
  ]);

  await prismaClient.recentSearch.deleteMany({
    where: { accountId: account.id, searchedAccountId: searchedAccount.id },
  });
}
