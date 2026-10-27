export enum PlayerLevel {
  COMMON = 'common',
  POTENTIAL = 'potential',
  PROMISING = 'promising',
}

export const PLAYER_LEVEL_LABEL: Record<PlayerLevel, string> = {
  [PlayerLevel.COMMON]: 'Comum',
  [PlayerLevel.POTENTIAL]: 'Com Potencial',
  [PlayerLevel.PROMISING]: 'Promissor',
};

export function toPlayerLevel(ratingScore: number) {
  if (ratingScore >= 8.5) return PlayerLevel.PROMISING;
  if (ratingScore >= 7) return PlayerLevel.POTENTIAL;

  return PlayerLevel.COMMON;
}
