import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { AccountType } from '../account/constants.js';
import { toProfileCard } from '../account/mappers.js';
import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { NotificationTitle } from '../notification/constants.js';
import { createNotification } from '../notification/service.js';
import { canViewContent } from '../profile/access.js';
import { CLUB_MEMBER_TYPES, CLUB_TYPE, ClubAction, ClubMemberStatus } from './constants.js';
import { findActiveClub } from './queries.js';

function membershipKey(clubId, memberId) {
  return { clubId_memberId: { clubId, memberId } };
}

function assertClub(account) {
  if (account.type !== CLUB_TYPE) throw new HttpError(403, 'Só times têm clube');
}

function assertMemberType(account) {
  if (!CLUB_MEMBER_TYPES.includes(account.type)) {
    throw new HttpError(403, 'Só players e scouts entram em clubes');
  }
}

export async function getClubAction(viewer, account) {
  if (viewer.type !== CLUB_TYPE || !CLUB_MEMBER_TYPES.includes(account.type)) return null;

  const membership = await prismaClient.clubMember.findUnique({
    where: membershipKey(viewer.id, account.id),
  });

  if (!membership) return ClubAction.INVITE;

  return membership.status === ClubMemberStatus.INVITED ? ClubAction.INVITED : ClubAction.MEMBER;
}

export async function listClubMembers(viewerUserId, username) {
  const [viewer, club] = await Promise.all([
    findAccountByUserId(viewerUserId),
    findAccountByUsername(username),
  ]);

  assertClub(club);

  if (!(await canViewContent(viewer, club))) throw new HttpError(403, 'Esta conta é privada');

  const memberships = await prismaClient.clubMember.findMany({
    where: { clubId: club.id, status: ClubMemberStatus.ACTIVE },
    orderBy: { joinedAt: 'asc' },
    include: { member: { include: PROFILE_CARD_INCLUDE } },
  });
  const members = memberships.map(({ member }) => toProfileCard(member));

  return {
    athletes: members.filter((member) => member.type === AccountType.PLAYER),
    scouts: members.filter((member) => member.type === AccountType.SCOUT),
  };
}

export async function inviteToClub(viewerUserId, username) {
  const [club, member] = await Promise.all([
    findAccountByUserId(viewerUserId),
    findAccountByUsername(username),
  ]);

  assertClub(club);
  assertMemberType(member);

  const existing = await prismaClient.clubMember.findUnique({ where: membershipKey(club.id, member.id) });

  if (existing) {
    throw new HttpError(
      409,
      existing.status === ClubMemberStatus.ACTIVE ? 'Já faz parte do seu clube' : 'O convite já foi enviado'
    );
  }

  await prismaClient.$transaction(async (transaction) => {
    await transaction.clubMember.create({
      data: { clubId: club.id, memberId: member.id, status: ClubMemberStatus.INVITED },
    });
    await createNotification(
      {
        userGeneratorNotification: club.id,
        userReceivesNotification: member.id,
        title: NotificationTitle.CLUB_INVITE,
      },
      transaction
    );
  });
}

export async function removeFromClub(viewerUserId, username) {
  const [club, member] = await Promise.all([
    findAccountByUserId(viewerUserId),
    findAccountByUsername(username),
  ]);

  assertClub(club);

  const { count } = await prismaClient.clubMember.deleteMany({
    where: { clubId: club.id, memberId: member.id },
  });

  if (count === 0) throw new HttpError(404, 'Essa pessoa não está no seu clube');
}

export async function getMyClub(userId) {
  const account = await findAccountByUserId(userId);

  if (!CLUB_MEMBER_TYPES.includes(account.type)) return { club: null, invites: [] };

  const [club, invites] = await Promise.all([
    findActiveClub(account.id),
    prismaClient.clubMember.findMany({
      where: { memberId: account.id, status: ClubMemberStatus.INVITED },
      orderBy: { createdAt: 'desc' },
      include: { club: { include: PROFILE_CARD_INCLUDE } },
    }),
  ]);

  return {
    club,
    invites: invites.map((invite) => ({ club: toProfileCard(invite.club), invitedAt: invite.createdAt })),
  };
}

export async function acceptClubInvite(userId, clubUsername) {
  const [member, club] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(clubUsername),
  ]);

  await prismaClient.$transaction(async (transaction) => {
    const { count } = await transaction.clubMember.updateMany({
      where: { clubId: club.id, memberId: member.id, status: ClubMemberStatus.INVITED },
      data: { status: ClubMemberStatus.ACTIVE, joinedAt: new Date() },
    });

    if (count === 0) throw new HttpError(404, 'Convite não encontrado');

    await transaction.clubMember.deleteMany({
      where: { memberId: member.id, status: ClubMemberStatus.ACTIVE, clubId: { not: club.id } },
    });
    await createNotification(
      {
        userGeneratorNotification: member.id,
        userReceivesNotification: club.id,
        title: NotificationTitle.CLUB_INVITE_ACCEPTED,
      },
      transaction
    );
  });

  return getMyClub(userId);
}

export async function declineClubInvite(userId, clubUsername) {
  const [member, club] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(clubUsername),
  ]);
  const { count } = await prismaClient.clubMember.deleteMany({
    where: { clubId: club.id, memberId: member.id, status: ClubMemberStatus.INVITED },
  });

  if (count === 0) throw new HttpError(404, 'Convite não encontrado');

  return getMyClub(userId);
}

export async function leaveClub(userId) {
  const member = await findAccountByUserId(userId);
  const { count } = await prismaClient.clubMember.deleteMany({
    where: { memberId: member.id, status: ClubMemberStatus.ACTIVE },
  });

  if (count === 0) throw new HttpError(404, 'Você não está em nenhum clube');

  return getMyClub(userId);
}
