import { get } from '../index';
import { ScoutingAthlete } from './type';

export function getScoutingAthletes(accessToken: string) {
  return get<{ athletes: ScoutingAthlete[] }>('/scouting/athletes', accessToken);
}
