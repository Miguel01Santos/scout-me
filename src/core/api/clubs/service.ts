import { del, get, postAuthenticated } from '../index';
import { ClubMembers, MyClub } from './type';

function profilePath(username: string) {
  return `/profiles/${encodeURIComponent(username)}`;
}

function invitePath(username: string) {
  return `/account/me/club-invites/${encodeURIComponent(username)}`;
}

export function getClubMembers(accessToken: string, username: string) {
  return get<ClubMembers>(`${profilePath(username)}/club-members`, accessToken);
}

export function inviteToClub(accessToken: string, username: string) {
  return postAuthenticated<null>(`${profilePath(username)}/club-invite`, accessToken);
}

export function removeFromClub(accessToken: string, username: string) {
  return del<null>(`${profilePath(username)}/club-member`, accessToken);
}

export function getMyClub(accessToken: string) {
  return get<MyClub>('/account/me/club', accessToken);
}

export function acceptClubInvite(accessToken: string, username: string) {
  return postAuthenticated<MyClub>(invitePath(username), accessToken);
}

export function declineClubInvite(accessToken: string, username: string) {
  return del<MyClub>(invitePath(username), accessToken);
}

export function leaveClub(accessToken: string) {
  return del<MyClub>('/account/me/club', accessToken);
}
