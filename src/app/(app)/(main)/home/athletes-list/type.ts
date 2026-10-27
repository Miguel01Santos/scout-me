import { ScoutingAthlete } from '@/src/core/api/scouting/type';

export interface AthletesListProps {
  athletes: ScoutingAthlete[];
  onSelect: (username: string) => void;
}
