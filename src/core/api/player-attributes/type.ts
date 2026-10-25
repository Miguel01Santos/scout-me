import { PlayerCategory, PlayerPosition, PreferredFoot } from '../../enums/player-attributes';

export interface PlayerAttributes {
  preferredFoot: PreferredFoot | null;
  position: PlayerPosition | null;
  category: PlayerCategory | null;
}

// A API recebe sempre os três campos; null limpa o atributo.
export type UpdatePlayerAttributesInput = PlayerAttributes;
