import { ScoutingAthlete } from '@/src/core/api/scouting/type';

export interface TacticalBlueprintTabProps {
  athletes: ScoutingAthlete[];
  onSelect: (username: string) => void;
}
