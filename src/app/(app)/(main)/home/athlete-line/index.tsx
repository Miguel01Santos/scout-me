'use client';

import { PLAYER_ATTRIBUTES_TEXT } from '@/src/core/enums/player-attributes';
import { useAccount } from '@/src/core/providers/account';
import { AthleteLineProps } from './type';

export function AthleteLine({ athlete }: AthleteLineProps) {
  const { configuration } = useAccount();
  const text = PLAYER_ATTRIBUTES_TEXT[configuration.language];
  const { position, category, preferredFoot } = athlete.playerAttributes;
  const details = [
    position && text.position.values[position].full,
    category && text.category.values[category].full,
    preferredFoot && text.preferredFoot.values[preferredFoot].full,
  ].filter(Boolean);

  return <>{details.length > 0 ? details.join(' • ') : 'Sem atributos'}</>;
}
