import { ProfileAvatarSize } from '../profile-avatar/type';

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: ProfileAvatarSize;
}
