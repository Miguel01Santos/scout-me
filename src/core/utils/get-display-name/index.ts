import { Profile } from '../../api/profile/type';

export function getDisplayName(
  userName: string,
  profile?: Pick<Profile, 'displayName' | 'showDisplayName'> | null
): string {
  return profile?.displayName && profile.showDisplayName ? profile.displayName : userName;
}
