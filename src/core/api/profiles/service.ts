import { del, get, postAuthenticated } from '../index';
import { ProfileCard, PublicProfile } from './type';

function profilePath(username: string) {
  return `/profiles/${encodeURIComponent(username)}`;
}

export function getPublicProfile(accessToken: string, username: string) {
  return get<{ profile: PublicProfile }>(profilePath(username), accessToken);
}

export function followProfile(accessToken: string, username: string) {
  return postAuthenticated<{ profile: PublicProfile }>(`${profilePath(username)}/follow`, accessToken);
}

export function unfollowProfile(accessToken: string, username: string) {
  return del<{ profile: PublicProfile }>(`${profilePath(username)}/follow`, accessToken);
}

export function searchProfiles(accessToken: string, search: string) {
  return get<{ profiles: ProfileCard[] }>(
    `/profiles?search=${encodeURIComponent(search)}`,
    accessToken
  );
}
