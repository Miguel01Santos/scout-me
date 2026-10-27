import { ScoutingAthlete } from '@/src/core/api/scouting/type';
import { PlayerCategory } from '@/src/core/enums/player-attributes';
import { RATING_CRITERIA, RATING_MAX, RatingCriterion } from '@/src/core/enums/rating';
import { AthleteComparison, Blueprint, GrowthTrend, McdmRankEntry } from './type';

export const DEFAULT_BLUEPRINT: Blueprint = {
  [RatingCriterion.TECHNIQUE]: 0.3,
  [RatingCriterion.TACTICS]: 0.3,
  [RatingCriterion.PHYSICAL]: 0.2,
  [RatingCriterion.CREATIVITY]: 0.1,
  [RatingCriterion.EVOLUTION]: 0.1,
};

export const MCDM_WEIGHTS = { score: 0.5, solidity: 0.25, potential: 0.25 };

const SOLID_RATINGS_COUNT = 5;
const YOUNG_CATEGORIES = [
  PlayerCategory.U7,
  PlayerCategory.U9,
  PlayerCategory.U11,
  PlayerCategory.U13,
  PlayerCategory.U15,
];
const YOUNG_POTENTIAL = 10;
const DEFAULT_POTENTIAL = 8;
const FAST_GROWTH = 0.3;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function tacticalFit(athlete: ScoutingAthlete, blueprint: Blueprint) {
  const criteria = athlete.ratingCriteria;

  if (!criteria) return null;

  return round(
    RATING_CRITERIA.reduce(
      (sum, criterion) => sum + (criteria[criterion] / RATING_MAX) * 100 * blueprint[criterion],
      0
    )
  );
}

export function compareAthletes(first: ScoutingAthlete, second: ScoutingAthlete): AthleteComparison {
  return {
    scoreGap: round(first.ratingScore - second.ratingScore),
    criteria: RATING_CRITERIA.map((criterion) => {
      const firstValue = first.ratingCriteria?.[criterion] ?? null;
      const secondValue = second.ratingCriteria?.[criterion] ?? null;
      const delta =
        firstValue === null || secondValue === null ? null : round(firstValue - secondValue);

      return { criterion, first: firstValue, second: secondValue, delta };
    }),
  };
}

export function growthTrend(athlete: ScoutingAthlete): GrowthTrend {
  const { evolution } = athlete;

  if (evolution.length < 2) return { velocity: 0, label: 'Estável' };

  const velocity = round(
    (evolution[evolution.length - 1].score - evolution[0].score) / (evolution.length - 1)
  );

  if (velocity > FAST_GROWTH) return { velocity, label: 'Evolução acelerada' };
  if (velocity < 0) return { velocity, label: 'Regressão, atenção' };

  return { velocity, label: 'Constante' };
}

export function solidity(athlete: ScoutingAthlete) {
  return (Math.min(athlete.publicRatingsCount, SOLID_RATINGS_COUNT) / SOLID_RATINGS_COUNT) * RATING_MAX;
}

export function potential(athlete: ScoutingAthlete) {
  const category = athlete.playerAttributes.category;

  return category && YOUNG_CATEGORIES.includes(category) ? YOUNG_POTENTIAL : DEFAULT_POTENTIAL;
}

export function mcdmRank(athletes: ScoutingAthlete[]): McdmRankEntry[] {
  return athletes
    .map((athlete) => ({
      athlete,
      index: round(
        athlete.ratingScore * MCDM_WEIGHTS.score +
          solidity(athlete) * MCDM_WEIGHTS.solidity +
          potential(athlete) * MCDM_WEIGHTS.potential
      ),
      trend: growthTrend(athlete),
    }))
    .sort((first, second) => second.index - first.index);
}
