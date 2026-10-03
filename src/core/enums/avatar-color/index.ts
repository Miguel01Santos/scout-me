export enum AvatarColor {
  INDIGO = 'indigo',
  EMERALD = 'emerald',
  SKY = 'sky',
  AMBER = 'amber',
  ORANGE = 'orange',
  ROSE = 'rose',
  FUCHSIA = 'fuchsia',
  SLATE = 'slate',
}

export const AVATAR_COLOR_NAME: Record<AvatarColor, string> = {
  [AvatarColor.INDIGO]: 'Índigo',
  [AvatarColor.EMERALD]: 'Esmeralda',
  [AvatarColor.SKY]: 'Azul',
  [AvatarColor.AMBER]: 'Âmbar',
  [AvatarColor.ORANGE]: 'Laranja',
  [AvatarColor.ROSE]: 'Rosa',
  [AvatarColor.FUCHSIA]: 'Fúcsia',
  [AvatarColor.SLATE]: 'Cinza',
};

export const AVATAR_COLOR_STYLE: Record<AvatarColor, { background: string; text: string }> = {
  [AvatarColor.INDIGO]: { background: '#6366f1', text: '#ffffff' },
  [AvatarColor.EMERALD]: { background: '#10b981', text: '#ffffff' },
  [AvatarColor.SKY]: { background: '#0ea5e9', text: '#ffffff' },
  [AvatarColor.AMBER]: { background: '#f59e0b', text: '#451a03' },
  [AvatarColor.ORANGE]: { background: '#f97316', text: '#ffffff' },
  [AvatarColor.ROSE]: { background: '#f43f5e', text: '#ffffff' },
  [AvatarColor.FUCHSIA]: { background: '#d946ef', text: '#ffffff' },
  [AvatarColor.SLATE]: { background: '#64748b', text: '#ffffff' },
};

export function toAvatarColor(color?: string | null): AvatarColor | null {
  const avatarColors: string[] = Object.values(AvatarColor);

  return color && avatarColors.includes(color) ? (color as AvatarColor) : null;
}
