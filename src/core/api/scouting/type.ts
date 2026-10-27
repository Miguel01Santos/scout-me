import { PlayerAttributes } from '../player-attributes/type';
import { ProfileCard } from '../profiles/type';
import { RatingCriteria } from '../ratings/type';

export interface RatingEvolutionPoint {
  date: string;
  score: number;
}

export interface ScoutingAthlete extends ProfileCard {
  playerAttributes: PlayerAttributes;
  ratingScore: number;
  ratingsCount: number;
  publicRatingsCount: number;
  ratingCriteria: RatingCriteria | null;
  evolution: RatingEvolutionPoint[];
}
