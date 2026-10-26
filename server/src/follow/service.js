import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toProfileCard } from '../account/mappers.js';
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

export async function followAccount(follower, followed) {
  if (follower.id === followed.id) {
    throw new HttpError(400, 'Você não pode seguir o próprio perfil');
  }

  const status = followed.isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED;
  const follow = await prismaClient.follow.upsert({
    where: followKey(follower.id, followed.id),
    update: {},
    create: {
      followerId: follower.id,
      followedId: followed.id,
      status,
      acceptedAt: status === FollowStatus.ACCEPTED ? new Date() : null,
    },
  });

  return follow.status;
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

export async function acceptFollowRequest(accountId, followerId) {
  const { count } = await prismaClient.follow.updateMany({
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
