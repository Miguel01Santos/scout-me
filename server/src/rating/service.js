import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toProfileCard } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername, getAccount } from '../account/service.js';
import { FollowStatus } from '../follow/constants.js';
import { findFollowStatus, followAndNotify, PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { NotificationTitle } from '../notification/constants.js';
import { createNotification } from '../notification/service.js';
import {
  PRIVATE_RATER_TYPES,
  PUBLIC_RATER_TYPES,
  RATED_TYPE,
  RATING_REQUEST_TARGET_TYPE,
  RATING_REQUESTER_TYPE,
  RatingActionStatus,
  RatingStatus,
} from './constants.js';
import { RATING_ITEM_SELECT, toRatingItem } from './mappers.js';
import { CRITERIA_SELECT, refreshRatingScore, refreshScoutScore, toCriteria } from './score.js';

const UNIQUE_CONSTRAINT_ERROR = 'P2002';

function canRate(viewer, account, isPrivate) {
  return (
    viewer.id !== account.id &&
    account.type === RATED_TYPE &&
    (isPrivate ? PRIVATE_RATER_TYPES : PUBLIC_RATER_TYPES).includes(viewer.type)
  );
}

function canRequestRating(viewer, account) {
  return viewer.type === RATING_REQUESTER_TYPE && account.type === RATING_REQUEST_TARGET_TYPE;
}

function hasPrivacy(items, isPrivate) {
  return items.some((item) => item.isPrivate === isPrivate);
}

function ratedNotificationTitle(isPrivate, isPending) {
  if (isPrivate) return NotificationTitle.RATED_YOU_PRIVATELY;

  return isPending ? NotificationTitle.RATED_YOU_PENDING : NotificationTitle.RATED_YOU;
}

async function findPlayerAccount(userId) {
  const account = await findAccountByUserId(userId);

  if (account.type !== RATED_TYPE) {
    throw new HttpError(403, 'Só contas Player recebem avaliações');
  }

  return account;
}

async function findViewerAndProfile(viewerUserId, username) {
  return Promise.all([findAccountByUserId(viewerUserId), findAccountByUsername(username)]);
}

export async function getRatingActions(viewer, account) {
  const [given, requested, received] = await Promise.all([
    prismaClient.rating.findMany({
      where: { raterId: viewer.id, ratedId: account.id },
      select: { isPrivate: true },
    }),
    prismaClient.ratingRequest.findMany({
      where: { requesterId: viewer.id, scoutId: account.id },
      select: { isPrivate: true },
    }),
    prismaClient.rating.findMany({
      where: { raterId: account.id, ratedId: viewer.id },
      select: { isPrivate: true },
    }),
  ]);

  function rateStatus(isPrivate) {
    if (!canRate(viewer, account, isPrivate)) return RatingActionStatus.UNAVAILABLE;

    return hasPrivacy(given, isPrivate) ? RatingActionStatus.DONE : RatingActionStatus.AVAILABLE;
  }

  function requestStatus(isPrivate) {
    if (!canRequestRating(viewer, account)) return RatingActionStatus.UNAVAILABLE;
    if (hasPrivacy(received, isPrivate)) return RatingActionStatus.DONE;

    return hasPrivacy(requested, isPrivate) ? RatingActionStatus.PENDING : RatingActionStatus.AVAILABLE;
  }

  return {
    rate: rateStatus(false),
    ratePrivately: rateStatus(true),
    requestRating: requestStatus(false),
    requestPrivateRating: requestStatus(true),
  };
}

export async function rateProfile(viewerUserId, username, { isPrivate, ...criteria }) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  if (viewer.id === account.id) {
    throw new HttpError(400, 'Você não pode avaliar o próprio perfil');
  }

  if (account.type !== RATED_TYPE) {
    throw new HttpError(403, 'Só contas Player podem ser avaliadas');
  }

  if (!canRate(viewer, account, isPrivate)) {
    throw new HttpError(
      403,
      isPrivate ? 'Só scouts podem fazer avaliações privadas' : 'Seu tipo de conta não pode avaliar players'
    );
  }

  const isPending = !isPrivate && account.reviewRatings;

  try {
    await prismaClient.$transaction(async (transaction) => {
      await transaction.rating.create({
        data: {
          raterId: viewer.id,
          ratedId: account.id,
          isPrivate,
          status: isPending ? RatingStatus.PENDING : RatingStatus.PUBLISHED,
          ...criteria,
        },
      });

      if (!isPrivate && !isPending) await refreshRatingScore(account, transaction);
      if (!isPending) await refreshScoutScore(viewer.id, transaction);

      await followAndNotify(viewer, account, transaction);
      await createNotification(
        {
          userGeneratorNotification: viewer.id,
          userReceivesNotification: account.id,
          title: ratedNotificationTitle(isPrivate, isPending),
        },
        transaction
      );
    });
  } catch (error) {
    if (error.code === UNIQUE_CONSTRAINT_ERROR) {
      throw new HttpError(409, 'Você já avaliou este perfil');
    }

    throw error;
  }
}

export async function requestRating(viewerUserId, username, { isPrivate }) {
  const [viewer, account] = await findViewerAndProfile(viewerUserId, username);

  if (!canRequestRating(viewer, account)) {
    throw new HttpError(403, 'Só players podem pedir avaliação a scouts');
  }

  const alreadyRated = await prismaClient.rating.findUnique({
    where: { raterId_ratedId_isPrivate: { raterId: account.id, ratedId: viewer.id, isPrivate } },
    select: { id: true },
  });

  if (alreadyRated) {
    throw new HttpError(409, 'Este scout já avaliou você');
  }

  try {
    await prismaClient.$transaction(async (transaction) => {
      await transaction.ratingRequest.create({
        data: { requesterId: viewer.id, scoutId: account.id, isPrivate },
      });
      await followAndNotify(viewer, account, transaction);
      await createNotification(
        {
          userGeneratorNotification: viewer.id,
          userReceivesNotification: account.id,
          title: isPrivate ? NotificationTitle.REQUEST_PRIVATE_RATING : NotificationTitle.REQUEST_RATING,
        },
        transaction
      );
    });
  } catch (error) {
    if (error.code === UNIQUE_CONSTRAINT_ERROR) {
      throw new HttpError(409, 'Você já pediu essa avaliação. Aguarde o scout avaliar.');
    }

    throw error;
  }
}

export async function listPrivateRatings(userId) {
  const account = await findAccountByUserId(userId);
  const ratings = await prismaClient.rating.findMany({
    where: { ratedId: account.id, isPrivate: true },
    orderBy: { createdAt: 'desc' },
    select: {
      ...CRITERIA_SELECT,
      createdAt: true,
      updatedAt: true,
      rater: { include: PROFILE_CARD_INCLUDE },
    },
  });

  return ratings.map((rating) => ({
    rater: toProfileCard(rating.rater),
    criteria: toCriteria(rating),
    createdAt: rating.createdAt,
    updatedAt: rating.updatedAt,
  }));
}

export async function listPendingRatings(userId) {
  const account = await findPlayerAccount(userId);
  const ratings = await prismaClient.rating.findMany({
    where: { ratedId: account.id, status: RatingStatus.PENDING },
    orderBy: { createdAt: 'desc' },
    select: { ...CRITERIA_SELECT, createdAt: true, rater: { include: PROFILE_CARD_INCLUDE } },
  });

  return ratings.map((rating) => ({
    rater: toProfileCard(rating.rater),
    criteria: toCriteria(rating),
    createdAt: rating.createdAt,
  }));
}

async function changePendingRating(userId, raterUsername, status) {
  const [account, rater] = await Promise.all([
    findPlayerAccount(userId),
    findAccountByUsername(raterUsername),
  ]);

  await prismaClient.$transaction(async (transaction) => {
    const { count } = await transaction.rating.updateMany({
      where: { raterId: rater.id, ratedId: account.id, status: RatingStatus.PENDING },
      data: { status },
    });

    if (count === 0) throw new HttpError(404, 'Avaliação pendente não encontrada');

    if (status === RatingStatus.PUBLISHED) {
      await refreshRatingScore(account, transaction);
      await refreshScoutScore(rater.id, transaction);
    }
  });

  return getAccount(userId);
}

export function publishPendingRating(userId, raterUsername) {
  return changePendingRating(userId, raterUsername, RatingStatus.PUBLISHED);
}

export function hidePendingRating(userId, raterUsername) {
  return changePendingRating(userId, raterUsername, RatingStatus.HIDDEN);
}

async function canViewRating(viewer, rating) {
  if (viewer.id === rating.raterId || viewer.id === rating.ratedId) return true;
  if (rating.isPrivate || rating.status !== RatingStatus.PUBLISHED) return false;
  if (!rating.rated.isPrivate) return true;

  return (await findFollowStatus(viewer.id, rating.ratedId)) === FollowStatus.ACCEPTED;
}

export async function getRating(viewerUserId, ratingId) {
  const [viewer, rating] = await Promise.all([
    findAccountByUserId(viewerUserId),
    prismaClient.rating.findUnique({
      where: { id: ratingId },
      select: { ...RATING_ITEM_SELECT, raterId: true, ratedId: true },
    }),
  ]);

  if (!rating || !(await canViewRating(viewer, rating))) {
    throw new HttpError(404, 'Avaliação não encontrada');
  }

  return toRatingItem(rating);
}

export async function listReceivedRatings(userId) {
  const account = await findAccountByUserId(userId);
  const ratings = await prismaClient.rating.findMany({
    where: {
      ratedId: account.id,
      OR: [{ isPrivate: true }, { status: RatingStatus.PUBLISHED }],
    },
    orderBy: { createdAt: 'desc' },
    select: RATING_ITEM_SELECT,
  });

  return ratings.map(toRatingItem);
}

export async function listGivenRatings(userId) {
  const account = await findAccountByUserId(userId);
  const ratings = await prismaClient.rating.findMany({
    where: { raterId: account.id },
    orderBy: { createdAt: 'desc' },
    select: RATING_ITEM_SELECT,
  });

  return ratings.map(toRatingItem);
}

export async function cancelGivenRating(userId, ratingId) {
  const account = await findAccountByUserId(userId);
  const { count } = await prismaClient.rating.deleteMany({
    where: { id: ratingId, raterId: account.id, status: RatingStatus.PENDING },
  });

  if (count === 0) {
    throw new HttpError(404, 'Só dá para cancelar avaliações que ainda estão pendentes');
  }
}
