import { ScoutingAthlete } from '@/src/core/api/scouting/type';
import { RatingCriterion } from '@/src/core/enums/rating';

export type Blueprint = Record<RatingCriterion, number>;

export interface CriterionComparison {
  criterion: RatingCriterion;
  first: number | null;
  second: number | null;
  delta: number | null;
}

export interface AthleteComparison {
  scoreGap: number;
  criteria: CriterionComparison[];
}

export interface GrowthTrend {
  velocity: number;
  label: string;
}

export interface McdmRankEntry {
  athlete: ScoutingAthlete;
  index: number;
  trend: GrowthTrend;
}
