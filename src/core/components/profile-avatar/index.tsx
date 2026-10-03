import { Avatar } from '@heroui/react';
import { AVATAR_COLOR_STYLE } from '../../enums/avatar-color';
import { getInitials } from '../../utils/get-initials';
import { ProfileAvatarProps, ProfileAvatarSize } from './type';

const SIZE_CLASS_NAME: Record<ProfileAvatarSize, { root: string; text: string }> = {
  sm: { root: 'size-[35px]', text: 'text-xs' },
  md: { root: 'size-10', text: 'text-sm' },
  lg: { root: 'size-24', text: 'text-3xl' },
};

export function ProfileAvatar({ name, avatarUrl, color, size = 'lg' }: ProfileAvatarProps) {
  const sizeClassName = SIZE_CLASS_NAME[size];
  const colorStyle = color
    ? { backgroundColor: AVATAR_COLOR_STYLE[color].background, color: AVATAR_COLOR_STYLE[color].text }
    : undefined;

  return (
    <Avatar className={`${sizeClassName.root} shrink-0 rounded-full`}>
      <Avatar.Image alt={name} src={avatarUrl ?? undefined} className="rounded-full" />
      <Avatar.Fallback className={`rounded-full ${sizeClassName.text}`} style={colorStyle}>
        {getInitials(name)}
      </Avatar.Fallback>
    </Avatar>
  );
}
