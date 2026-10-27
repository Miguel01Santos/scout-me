import { prismaClient } from '../prisma.js';
import { toProfileCard } from '../account/mappers.js';
import { findAccountByUserId } from '../account/service.js';
import { FollowStatus } from '../follow/constants.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { POST_INCLUDE, toPublicPost } from '../post/service.js';
import { RatingStatus } from '../rating/constants.js';
import { RATING_ITEM_SELECT, toRatingItem } from '../rating/mappers.js';
import { FEED_PAGE_SIZE, FeedItemType } from './constants.js';

async function findFollowedIds(accountId) {
  const follows = await prismaClient.follow.findMany({
    where: { followerId: accountId, status: FollowStatus.ACCEPTED },
    select: { followedId: true },
  });

  return follows.map((follow) => follow.followedId);
}

export async function getFeed(userId, { before }) {
  const account = await findAccountByUserId(userId);
  const followedIds = await findFollowedIds(account.id);

  if (followedIds.length === 0) return { items: [], nextCursor: null };

  const createdAt = before ? { lt: before } : undefined;
  const [posts, ratings] = await Promise.all([
    prismaClient.post.findMany({
      where: { accountId: { in: followedIds }, createdAt },
      orderBy: { createdAt: 'desc' },
      take: FEED_PAGE_SIZE,
      include: { ...POST_INCLUDE, account: { include: PROFILE_CARD_INCLUDE } },
    }),
    prismaClient.rating.findMany({
      where: {
        ratedId: { in: followedIds },
        isPrivate: false,
        status: RatingStatus.PUBLISHED,
        createdAt,
      },
      orderBy: { createdAt: 'desc' },
      take: FEED_PAGE_SIZE,
      select: RATING_ITEM_SELECT,
    }),
  ]);

  const items = [
    ...posts.map((post) => ({
      type: FeedItemType.POST,
      id: `${FeedItemType.POST}-${post.id}`,
      createdAt: post.createdAt,
      author: toProfileCard(post.account),
      post: toPublicPost(post),
    })),
    ...ratings.map((rating) => ({
      type: FeedItemType.RATING,
      id: `${FeedItemType.RATING}-${rating.id}`,
      createdAt: rating.createdAt,
      rating: toRatingItem(rating),
    })),
  ]
    .sort((first, second) => second.createdAt - first.createdAt)
    .slice(0, FEED_PAGE_SIZE);

  const hasMore =
    posts.length === FEED_PAGE_SIZE ||
    ratings.length === FEED_PAGE_SIZE ||
    posts.length + ratings.length > items.length;

  return { items, nextCursor: hasMore ? items.at(-1).createdAt : null };
}
