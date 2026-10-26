import { prismaClient } from '../prisma.js';
import { AccountType } from '../account/constants.js';
import { toProfileCard, toPublicPlayerAttributes } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import { FollowStatus } from '../follow/constants.js';
import { SEARCH_FILTER_ACCOUNT_TYPES } from './constants.js';
import {
  countFollows,
  findFollowStatus,
  followAccount,
  PROFILE_CARD_INCLUDE,
  unfollowAccount,
} from '../follow/service.js';

const SEARCH_CANDIDATES = 50;
const SEARCH_RESULTS = 20;

function searchRelevance(card, term) {
  if (card.username === term) return 0;
  if (card.username.startsWith(term)) return 1;
  if (card.name.toLowerCase().startsWith(term)) return 2;

  return 3;
}

const NOT_FOLLOWING = 'none';

async function buildPublicProfile(viewer, account) {
  const isOwner = viewer.id === account.id;
  const followStatus = isOwner
    ? null
    : ((await findFollowStatus(viewer.id, account.id)) ?? NOT_FOLLOWING);
  const canViewDetails =
    isOwner || !account.isPrivate || followStatus === FollowStatus.ACCEPTED;
  const { followersCount, followingCount } = await countFollows(account.id);

  return {
    ...toProfileCard(account),
    isPrivate: account.isPrivate,
    bio: canViewDetails ? (account.profile?.bio ?? null) : null,
    playerAttributes:
      canViewDetails && account.type === AccountType.PLAYER
        ? toPublicPlayerAttributes(account.playerAttributes)
        : null,
    followersCount,
    followingCount,
    isOwner,
    followStatus,
    canViewDetails,
  };
}

async function findViewerAndProfile(viewerUserId, username) {
  return Promise.all([findAccountByUserId(viewerUserId), findAccountByUsername(username)]);
}

export async function searchProfiles(viewerUserId, search, filter) {
  const viewer = await findAccountByUserId(viewerUserId);
  const term = search.replace(/^@/, '').toLowerCase();
  const accountTypes = SEARCH_FILTER_ACCOUNT_TYPES[filter];
  const accounts = await prismaClient.account.findMany({
    where: {
      id: { not: viewer.id },
      type: accountTypes ? { in: accountTypes } : { not: null },
      OR: [
        { username: { contains: term } },
        { user: { name: { contains: term, mode: 'insensitive' } } },
        { profile: { displayName: { contains: term, mode: 'insensitive' }, showDisplayName: true } },
      ],
    },
    include: PROFILE_CARD_INCLUDE,
    take: SEARCH_CANDIDATES,
  });

  return accounts
    .map(toProfileCard)
    .sort((first, second) => searchRelevance(first, term) - searchRelevance(second, term))
    .slice(0, SEARCH_RESULTS);
}

export async function getPublicProfile(viewerUserId, username) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  return buildPublicProfile(viewer, account);
}

export async function followProfile(viewerUserId, username) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  await followAccount(viewer, account);

  return buildPublicProfile(viewer, account);
}

export async function unfollowProfile(viewerUserId, username) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  await unfollowAccount(viewer.id, account.id);

  return buildPublicProfile(viewer, account);
}
