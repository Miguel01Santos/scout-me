import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { AccountType } from '../account/constants.js';
import { toProfileCard, toPublicPlayerAttributes } from '../account/mappers.js';
import { findAccountByUserId } from '../account/service.js';
import { FollowStatus } from '../follow/constants.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { RatingStatus } from '../rating/constants.js';
import {
  COUNTED_RATINGS_WHERE,
  CRITERIA_SELECT,
  criteriaAverages,
  ratingEvolution,
} from '../rating/score.js';

export async function listScoutingAthletes(userId) {
  const account = await findAccountByUserId(userId);

  if (account.type !== AccountType.SCOUT) {
    throw new HttpError(403, 'A lista de atletas é só para contas Scout');
  }

  const athletes = await prismaClient.account.findMany({
    where: {
      type: AccountType.PLAYER,
      followers: { some: { followerId: account.id, status: FollowStatus.ACCEPTED } },
    },
    include: { ...PROFILE_CARD_INCLUDE, playerAttributes: true },
    orderBy: { ratingScore: 'desc' },
  });
  const athleteIds = athletes.map((athlete) => athlete.id);
  const [ratings, counts] = await Promise.all([
    prismaClient.rating.findMany({
      where: { ratedId: { in: athleteIds }, isPrivate: false, status: RatingStatus.PUBLISHED },
      orderBy: { createdAt: 'asc' },
      select: { ratedId: true, createdAt: true, ...CRITERIA_SELECT, rater: { select: { type: true } } },
    }),
    prismaClient.rating.groupBy({
      by: ['ratedId'],
      where: { ratedId: { in: athleteIds }, ...COUNTED_RATINGS_WHERE },
      _count: { _all: true },
    }),
  ]);

  return athletes.map((athlete) => {
    const athleteRatings = ratings.filter((rating) => rating.ratedId === athlete.id);

    return {
      ...toProfileCard(athlete),
      playerAttributes: toPublicPlayerAttributes(athlete.playerAttributes),
      ratingScore: athlete.ratingScore,
      ratingsCount: counts.find((count) => count.ratedId === athlete.id)?._count._all ?? 0,
      publicRatingsCount: athleteRatings.length,
      ratingCriteria: criteriaAverages(athleteRatings),
      evolution: ratingEvolution(athleteRatings),
    };
  });
}
