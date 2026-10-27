import { ProfileCard } from '../profiles/type';

export interface ClubMembers {
  athletes: ProfileCard[];
  scouts: ProfileCard[];
}

export interface ClubInvite {
  club: ProfileCard;
  invitedAt: string;
}

export interface MyClub {
  club: ProfileCard | null;
  invites: ClubInvite[];
}
