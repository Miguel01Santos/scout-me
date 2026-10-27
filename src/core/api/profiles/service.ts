import { del, get, postAuthenticated } from '../index';
import { ProfileCard, PublicProfile, SearchProfilesInput } from './type';

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

export function searchProfiles(accessToken: string, input: SearchProfilesInput) {
  const params = new URLSearchParams(
    Object.entries(input).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  return get<{ profiles: ProfileCard[] }>(`/profiles?${params}`, accessToken);
}

export function getProfileFollowers(accessToken: string, username: string) {
  return get<{ profiles: ProfileCard[] }>(`${profilePath(username)}/followers`, accessToken);
}

export function getProfileFollowing(accessToken: string, username: string) {
  return get<{ profiles: ProfileCard[] }>(`${profilePath(username)}/following`, accessToken);
}
