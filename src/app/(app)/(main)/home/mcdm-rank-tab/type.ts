import { ScoutingAthlete } from '@/src/core/api/scouting/type';

export interface McdmRankTabProps {
  athletes: ScoutingAthlete[];
  onSelect: (username: string) => void;
}
