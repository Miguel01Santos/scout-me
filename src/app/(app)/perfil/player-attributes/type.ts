import { PlayerAttributes } from '@/src/core/api/player-attributes/type';
import { Language } from '@/src/core/enums/language';

export interface PlayerAttributesSectionProps {
  attributes: PlayerAttributes;
  language: Language;
}
