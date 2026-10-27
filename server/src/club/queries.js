import { prismaClient } from '../prisma.js';
import { AccountType } from '../account/constants.js';
import { toProfileCard } from '../account/mappers.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { ClubMemberStatus } from './constants.js';

export async function findActiveClub(memberId) {
  const membership = await prismaClient.clubMember.findFirst({
    where: { memberId, status: ClubMemberStatus.ACTIVE },
    include: { club: { include: PROFILE_CARD_INCLUDE } },
  });

  return membership ? toProfileCard(membership.club) : null;
}

export function countClubAthletes(clubId) {
  return prismaClient.clubMember.count({
    where: { clubId, status: ClubMemberStatus.ACTIVE, member: { type: AccountType.PLAYER } },
  });
}
