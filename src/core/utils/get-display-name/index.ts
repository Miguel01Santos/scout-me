import { Profile } from '../../api/profile/type';

export function getDisplayName(userName: string, profile?: Profile): string {
  return profile?.displayName && profile.showDisplayName ? profile.displayName : userName;
}
