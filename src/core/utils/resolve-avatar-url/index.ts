import { Profile } from '../../api/profile/type';

export function resolveAvatarUrl(profile?: Profile, fallbackUrl?: string | null): string | null {
  const profileUrl = profile?.avatarUrl;

  return profileUrl === undefined ? (fallbackUrl ?? null) : profileUrl;
}
