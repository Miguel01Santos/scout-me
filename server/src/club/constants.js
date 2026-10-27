import { AccountType } from '../account/constants.js';

export const ClubMemberStatus = {
  INVITED: 'invited',
  ACTIVE: 'active',
};

export const ClubAction = {
  INVITE: 'invite',
  INVITED: 'invited',
  MEMBER: 'member',
};

export const CLUB_TYPE = AccountType.TEAM;
export const CLUB_MEMBER_TYPES = [AccountType.PLAYER, AccountType.SCOUT];
