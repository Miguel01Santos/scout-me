import { prismaClient } from '../prisma.js';
import { AccountType } from '../account/constants.js';
import {
  DEFAULT_RATING_SCORE,
  MAX_RATING_SCORE,
  RATING_CRITERIA,
  RATING_WEIGHTS,
  RatingStatus,
  SCOUT_RATINGS_PER_STEP,
  SCOUT_SCORE_STEP,
  TYPES_WITH_DEFAULT_RATING_SCORE,
} from './constants.js';

export const CRITERIA_SELECT = Object.fromEntries(RATING_CRITERIA.map((criterion) => [criterion, true]));

function roundScore(value) {
  return Math.round(value * 100) / 100;
}

function averageOf(rating) {
  const total = RATING_CRITERIA.reduce((sum, criterion) => sum + rating[criterion], 0);

  return total / RATING_CRITERIA.length;
}

function weightedAverage(ratings, valueOf) {
  const totals = ratings.reduce(
    (sum, rating) => {
      const weight = RATING_WEIGHTS[rating.rater.type] ?? 0;

      return { value: sum.value + valueOf(rating) * weight, weight: sum.weight + weight };
    },
    { value: 0, weight: 0 }
  );

  return totals.weight > 0 ? roundScore(totals.value / totals.weight) : null;
}

function findPublicRatings(accountId, database) {
  return database.rating.findMany({
    where: { ratedId: accountId, isPrivate: false, status: RatingStatus.PUBLISHED },
    select: { ...CRITERIA_SELECT, rater: { select: { type: true } } },
  });
}

export function defaultRatingScore(type) {
  return TYPES_WITH_DEFAULT_RATING_SCORE.includes(type) ? DEFAULT_RATING_SCORE : 0;
}

export async function refreshRatingScore(account, database = prismaClient) {
  const ratings = await findPublicRatings(account.id, database);
  const ratingScore = weightedAverage(ratings, averageOf) ?? defaultRatingScore(account.type);

  await database.account.update({ where: { id: account.id }, data: { ratingScore } });
}

export const COUNTED_RATINGS_WHERE = { OR: [{ isPrivate: true }, { status: RatingStatus.PUBLISHED }] };

export function toCriteria(rating) {
  return Object.fromEntries(RATING_CRITERIA.map((criterion) => [criterion, rating[criterion]]));
}

export function criteriaAverages(ratings) {
  if (weightedAverage(ratings, averageOf) === null) return null;

  return Object.fromEntries(
    RATING_CRITERIA.map((criterion) => [criterion, weightedAverage(ratings, (rating) => rating[criterion])])
  );
}

export function ratingEvolution(ratings) {
  return ratings
    .map((rating, index) => ({
      date: rating.createdAt,
      score: weightedAverage(ratings.slice(0, index + 1), averageOf),
    }))
    .filter((point) => point.score !== null);
}

export async function getRatingSummary(account) {
  const [ratingsCount, ratings] = await Promise.all([
    prismaClient.rating.count({ where: { ratedId: account.id, ...COUNTED_RATINGS_WHERE } }),
    account.type === AccountType.PLAYER ? findPublicRatings(account.id, prismaClient) : [],
  ]);

  return {
    ratingScore: account.ratingScore,
    ratingsCount,
    ratingCriteria: criteriaAverages(ratings),
  };
}

export async function refreshScoutScore(raterId, database = prismaClient) {
  const givenCount = await database.rating.count({
    where: { raterId, ...COUNTED_RATINGS_WHERE },
  });
  const ratingScore = Math.min(
    MAX_RATING_SCORE,
    DEFAULT_RATING_SCORE + Math.floor(givenCount / SCOUT_RATINGS_PER_STEP) * SCOUT_SCORE_STEP
  );

  await database.account.updateMany({
    where: { id: raterId, type: AccountType.SCOUT },
    data: { ratingScore },
  });
}

export function countPendingRatings(accountId) {
  return prismaClient.rating.count({ where: { ratedId: accountId, status: RatingStatus.PENDING } });
}

export async function publishPendingRatings(account, database = prismaClient) {
  const pending = await database.rating.findMany({
    where: { ratedId: account.id, status: RatingStatus.PENDING },
    select: { raterId: true },
  });

  await database.rating.updateMany({
    where: { ratedId: account.id, status: RatingStatus.PENDING },
    data: { status: RatingStatus.PUBLISHED },
  });
  await refreshRatingScore(account, database);

  for (const { raterId } of pending) {
    await refreshScoutScore(raterId, database);
  }
}
