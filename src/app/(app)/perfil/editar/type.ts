import { AvatarColor } from '@/src/core/enums/avatar-color';

export interface DisplayNameSwitchProps {
  isSelected: boolean;
  displayName: string;
  userName: string;
  onChange: (isSelected: boolean) => void;
}

export interface AvatarColorPickerProps {
  value: AvatarColor | null;
  onChange: (color: AvatarColor | null) => void;
}
