import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { toProfileCard } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import {
  createPostUploadSignatures,
  destroyImage,
  toOwnedPostPhotoPublicId,
} from '../cloudinary/service.js';
import { FollowStatus } from '../follow/constants.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { NotificationTitle } from '../notification/constants.js';
import { createNotification } from '../notification/service.js';
import { canViewContent } from '../profile/access.js';
import { POST_POSITION_CONSTRAINT, POSTS_LIMIT } from './constants.js';

const UNIQUE_CONSTRAINT_ERROR = 'P2002';
const MENTIONS_ERROR = 'Você só pode mencionar amigos: pessoas que você segue e que seguem você';

export const POST_INCLUDE = {
  photos: { orderBy: { position: 'asc' }, select: { id: true, url: true, position: true } },
  mentions: { include: { account: { include: PROFILE_CARD_INCLUDE } } },
};

export function toPublicPost(post) {
  return {
    id: post.id,
    position: post.position,
    description: post.description,
    createdAt: post.createdAt,
    photos: post.photos,
    mentions: post.mentions.map(({ account }) => toProfileCard(account)),
  };
}

function friendsOf(accountId) {
  return {
    followers: { some: { followerId: accountId, status: FollowStatus.ACCEPTED } },
    following: { some: { followedId: accountId, status: FollowStatus.ACCEPTED } },
  };
}

async function findMentionedFriendIds(account, usernames) {
  if (usernames.length === 0) return [];

  const friends = await prismaClient.account.findMany({
    where: { username: { in: usernames }, ...friendsOf(account.id) },
    select: { id: true },
  });

  if (friends.length !== usernames.length) {
    throw new HttpError(422, MENTIONS_ERROR, [{ field: 'mentions', message: MENTIONS_ERROR }]);
  }

  return friends.map((friend) => friend.id);
}

async function notifyMentions(account, mentionedIds, database) {
  for (const mentionedId of mentionedIds) {
    await createNotification(
      {
        userGeneratorNotification: account.id,
        userReceivesNotification: mentionedId,
        title: NotificationTitle.MENTIONED_YOU,
      },
      database
    );
  }
}

async function findOwnPost(accountId, postId) {
  const post = await prismaClient.post.findFirst({
    where: { id: postId, accountId },
    include: { photos: true, mentions: true },
  });

  if (!post) throw new HttpError(404, 'Post não encontrado');

  return post;
}

async function findPublicPost(postId, database = prismaClient) {
  return toPublicPost(await database.post.findUnique({ where: { id: postId }, include: POST_INCLUDE }));
}

export async function listProfilePosts(viewerUserId, username) {
  const [viewer, account] = await Promise.all([
    findAccountByUserId(viewerUserId),
    findAccountByUsername(username),
  ]);

  if (!(await canViewContent(viewer, account))) {
    throw new HttpError(403, 'Esta conta é privada');
  }

  const posts = await prismaClient.post.findMany({
    where: { accountId: account.id },
    orderBy: { position: 'asc' },
    include: POST_INCLUDE,
  });

  return posts.map(toPublicPost);
}

export async function listFriends(userId) {
  const account = await findAccountByUserId(userId);
  const friends = await prismaClient.account.findMany({
    where: friendsOf(account.id),
    include: PROFILE_CARD_INCLUDE,
    orderBy: { username: 'asc' },
  });

  return friends.map(toProfileCard);
}

export async function createPostUploads(userId, count) {
  const account = await findAccountByUserId(userId);

  return createPostUploadSignatures(account.id, count);
}

export async function createPost(userId, { position, description, photos, mentions }) {
  const account = await findAccountByUserId(userId);
  const hasForeignPhoto = photos.some((url) => !toOwnedPostPhotoPublicId(url, account.id));

  if (hasForeignPhoto || new Set(photos).size !== photos.length) {
    throw new HttpError(400, 'Endereço de foto inválido');
  }

  const [mentionedIds, postsCount] = await Promise.all([
    findMentionedFriendIds(account, mentions),
    prismaClient.post.count({ where: { accountId: account.id } }),
  ]);

  if (postsCount >= POSTS_LIMIT) {
    throw new HttpError(409, `Você já tem ${POSTS_LIMIT} posts. Apague um para publicar outro.`);
  }

  try {
    return await prismaClient.$transaction(async (transaction) => {
      const post = await transaction.post.create({
        data: {
          accountId: account.id,
          position,
          description,
          photos: { create: photos.map((url, index) => ({ url, position: index + 1 })) },
          mentions: { create: mentionedIds.map((accountId) => ({ accountId })) },
        },
      });

      await notifyMentions(account, mentionedIds, transaction);

      return findPublicPost(post.id, transaction);
    });
  } catch (error) {
    if (error.code === UNIQUE_CONSTRAINT_ERROR) {
      throw new HttpError(409, 'Essa posição já tem um post');
    }

    throw error;
  }
}

export async function updatePost(userId, postId, { position, description, mentions }) {
  const account = await findAccountByUserId(userId);
  const post = await findOwnPost(account.id, postId);
  const mentionedIds = mentions === undefined ? null : await findMentionedFriendIds(account, mentions);

  return prismaClient.$transaction(async (transaction) => {
    if (position !== undefined && position !== post.position) {
      await transaction.$executeRawUnsafe(`SET CONSTRAINTS "${POST_POSITION_CONSTRAINT}" DEFERRED`);
      await transaction.post.updateMany({
        where: { accountId: account.id, position },
        data: { position: post.position },
      });
    }

    if (mentionedIds) {
      const previousIds = post.mentions.map((mention) => mention.accountId);

      await transaction.postMention.deleteMany({ where: { postId: post.id } });
      await transaction.postMention.createMany({
        data: mentionedIds.map((accountId) => ({ postId: post.id, accountId })),
      });
      await notifyMentions(
        account,
        mentionedIds.filter((mentionedId) => !previousIds.includes(mentionedId)),
        transaction
      );
    }

    const data = { updatedAt: new Date() };

    if (position !== undefined) data.position = position;
    if (description !== undefined) data.description = description;

    await transaction.post.update({ where: { id: post.id }, data });

    return findPublicPost(post.id, transaction);
  });
}

export async function deletePost(userId, postId) {
  const account = await findAccountByUserId(userId);
  const post = await findOwnPost(account.id, postId);

  await prismaClient.post.delete({ where: { id: post.id } });
  await Promise.all(
    post.photos
      .map((photo) => toOwnedPostPhotoPublicId(photo.url, account.id))
      .filter(Boolean)
      .map((publicId) => destroyImage(publicId))
  );
}
