import { AvatarColor } from '../../enums/avatar-color';

export interface Profile {
  displayName: string | null;
  showDisplayName: boolean;
  bio: string | null;
  avatarColor: AvatarColor | null;
}

export type UpdateProfileInput = Partial<Profile>;
