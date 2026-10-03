import { AvatarColor } from '../../enums/avatar-color';

export type ProfileAvatarSize = 'sm' | 'md' | 'lg';

export interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string | null;
  color?: AvatarColor | null;
  size?: ProfileAvatarSize;
}
