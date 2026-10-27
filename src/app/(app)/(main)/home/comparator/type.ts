import { ScoutingAthlete } from '@/src/core/api/scouting/type';

export type ComparatorTab = 'fit' | 'h2h' | 'mcdm';

export interface ComparatorProps {
  athletes: ScoutingAthlete[];
  onSelect: (username: string) => void;
}
