import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toProfileCard } from '../account/mappers.js';
import { NotificationTitle } from '../notification/constants.js';
import { createNotification } from '../notification/service.js';
import { FollowStatus } from './constants.js';

export const PROFILE_CARD_INCLUDE = {
  profile: true,
  user: { select: { name: true, avatarUrl: true } },
};

function followKey(followerId, followedId) {
  return { followerId_followedId: { followerId, followedId } };
}

export async function countFollows(accountId) {
  const [followersCount, followingCount, pendingFollowRequestsCount] = await Promise.all([
    prismaClient.follow.count({ where: { followedId: accountId, status: FollowStatus.ACCEPTED } }),
    prismaClient.follow.count({ where: { followerId: accountId, status: FollowStatus.ACCEPTED } }),
    prismaClient.follow.count({ where: { followedId: accountId, status: FollowStatus.PENDING } }),
  ]);

  return { followersCount, followingCount, pendingFollowRequestsCount };
}

export async function findFollowStatus(followerId, followedId) {
  const follow = await prismaClient.follow.findUnique({ where: followKey(followerId, followedId) });

  return follow?.status ?? null;
}

export async function followAccount(follower, followed, database = prismaClient) {
  if (follower.id === followed.id) {
    throw new HttpError(400, 'Você não pode seguir o próprio perfil');
  }

  const status = followed.isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED;
  const { count } = await database.follow.createMany({
    data: {
      followerId: follower.id,
      followedId: followed.id,
      status,
      acceptedAt: status === FollowStatus.ACCEPTED ? new Date() : null,
    },
    skipDuplicates: true,
  });

  return count > 0 ? status : null;
}

export async function followAndNotify(follower, followed, database = prismaClient) {
  const newStatus = await followAccount(follower, followed, database);

  if (!newStatus) return;

  await createNotification(
    {
      userGeneratorNotification: follower.id,
      userReceivesNotification: followed.id,
      title:
        newStatus === FollowStatus.PENDING
          ? NotificationTitle.REQUEST_FOLLOW
          : NotificationTitle.FOLLOWED_YOU_BACK,
    },
    database
  );
}

export async function unfollowAccount(followerId, followedId) {
  await prismaClient.follow.deleteMany({ where: { followerId, followedId } });
}

export async function listFollowRequests(accountId) {
  const requests = await prismaClient.follow.findMany({
    where: { followedId: accountId, status: FollowStatus.PENDING },
    orderBy: { createdAt: 'desc' },
    include: { follower: { include: PROFILE_CARD_INCLUDE } },
  });

  return requests.map(({ follower, createdAt }) => ({
    ...toProfileCard(follower),
    requestedAt: createdAt,
  }));
}

export async function acceptFollowRequest(accountId, followerId, database = prismaClient) {
  const { count } = await database.follow.updateMany({
    where: { followerId, followedId: accountId, status: FollowStatus.PENDING },
    data: { status: FollowStatus.ACCEPTED, acceptedAt: new Date() },
  });

  if (count === 0) throw new HttpError(404, 'Pedido não encontrado');
}

export async function declineFollowRequest(accountId, followerId) {
  const { count } = await prismaClient.follow.deleteMany({
    where: { followerId, followedId: accountId, status: FollowStatus.PENDING },
  });

  if (count === 0) throw new HttpError(404, 'Pedido não encontrado');
}

export async function acceptAllFollowRequests(accountId, database = prismaClient) {
  await database.follow.updateMany({
    where: { followedId: accountId, status: FollowStatus.PENDING },
    data: { status: FollowStatus.ACCEPTED, acceptedAt: new Date() },
  });
}

export async function listFollowers(accountId) {
  const follows = await prismaClient.follow.findMany({
    where: { followedId: accountId, status: FollowStatus.ACCEPTED },
    orderBy: { acceptedAt: 'desc' },
    include: { follower: { include: PROFILE_CARD_INCLUDE } },
  });

  return follows.map(({ follower }) => toProfileCard(follower));
}

export async function listFollowing(accountId) {
  const follows = await prismaClient.follow.findMany({
    where: { followerId: accountId, status: FollowStatus.ACCEPTED },
    orderBy: { acceptedAt: 'desc' },
    include: { followed: { include: PROFILE_CARD_INCLUDE } },
  });

  return follows.map(({ followed }) => toProfileCard(followed));
}
