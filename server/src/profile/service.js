import { prismaClient } from '../prisma.js';
import { AccountType } from '../account/constants.js';
import { toProfileCard, toPublicPlayerAttributes } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import { FollowStatus } from '../follow/constants.js';
import { PLAYER_LEVEL_SCORE_RANGES } from '../rating/constants.js';
import { getRatingSummary } from '../rating/score.js';
import { getRatingActions } from '../rating/service.js';
import { countClubAthletes, findActiveClub } from '../club/queries.js';
import { getClubAction } from '../club/service.js';
import { CLUB_MEMBER_TYPES, CLUB_TYPE } from '../club/constants.js';
import { SEARCH_FILTER_ACCOUNT_TYPES } from './constants.js';
import {
  countFollows,
  findFollowStatus,
  followAndNotify,
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
  const [{ followersCount, followingCount }, ratings, ratingActions, club, clubAction, athletesCount] =
    await Promise.all([
      countFollows(account.id),
      getRatingSummary(account),
      isOwner ? null : getRatingActions(viewer, account),
      CLUB_MEMBER_TYPES.includes(account.type) ? findActiveClub(account.id) : null,
      isOwner ? null : getClubAction(viewer, account),
      account.type === CLUB_TYPE ? countClubAthletes(account.id) : null,
    ]);

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
    ratingScore: ratings.ratingScore,
    ratingsCount: ratings.ratingsCount,
    ratingCriteria: canViewDetails ? ratings.ratingCriteria : null,
    ratingActions,
    club,
    clubAction,
    athletesCount,
    isOwner,
    followStatus,
    canViewDetails,
  };
}

async function findViewerAndProfile(viewerUserId, username) {
  return Promise.all([findAccountByUserId(viewerUserId), findAccountByUsername(username)]);
}

function searchAccountTypes(filter, hasPlayerFilters) {
  const groupTypes = SEARCH_FILTER_ACCOUNT_TYPES[filter];

  if (!hasPlayerFilters) return groupTypes;

  return (groupTypes ?? [AccountType.PLAYER]).filter((type) => type === AccountType.PLAYER);
}

export async function searchProfiles(viewerUserId, { search, filter, level, ...attributes }) {
  const viewer = await findAccountByUserId(viewerUserId);
  const term = search.replace(/^@/, '').toLowerCase();
  const playerAttributes = Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => value)
  );
  const hasAttributeFilters = Object.keys(playerAttributes).length > 0;
  const accountTypes = searchAccountTypes(filter, hasAttributeFilters || Boolean(level));
  const where = {
    id: { not: viewer.id },
    type: accountTypes ? { in: accountTypes } : { not: null },
  };

  if (term) {
    where.OR = [
      { username: { contains: term } },
      { user: { name: { contains: term, mode: 'insensitive' } } },
      { profile: { displayName: { contains: term, mode: 'insensitive' }, showDisplayName: true } },
    ];
  }

  if (hasAttributeFilters) where.playerAttributes = { is: playerAttributes };
  if (level) where.ratingScore = PLAYER_LEVEL_SCORE_RANGES[level];

  const accounts = await prismaClient.account.findMany({
    where,
    include: PROFILE_CARD_INCLUDE,
    orderBy: { ratingScore: 'desc' },
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

  await prismaClient.$transaction((transaction) => followAndNotify(viewer, account, transaction));

  return buildPublicProfile(viewer, account);
}

export async function unfollowProfile(viewerUserId, username) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  await unfollowAccount(viewer.id, account.id);

  return buildPublicProfile(viewer, account);
}
