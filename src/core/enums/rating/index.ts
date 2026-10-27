import { AccountType } from '../account-type';

export enum RatingCriterion {
  TECHNIQUE = 'technique',
  TACTICS = 'tactics',
  PHYSICAL = 'physical',
  CREATIVITY = 'creativity',
  EVOLUTION = 'evolution',
}

export const RATING_CRITERIA = Object.values(RatingCriterion);

export const RATING_CRITERION_LABEL: Record<RatingCriterion, string> = {
  [RatingCriterion.TECHNIQUE]: 'Técnica',
  [RatingCriterion.TACTICS]: 'Tática',
  [RatingCriterion.PHYSICAL]: 'Físico',
  [RatingCriterion.CREATIVITY]: 'Criatividade',
  [RatingCriterion.EVOLUTION]: 'Evolução',
};

export const RATING_MIN = 1;
export const RATING_MAX = 10;

export const RATING_WEIGHTS: Partial<Record<AccountType, number>> = {
  [AccountType.PLAYER]: 1,
  [AccountType.SCOUT]: 2,
  [AccountType.ORGANIZATION]: 3,
};

export const STARS_PER_POINT = 0.5;

export function toStars(ratingScore: number) {
  return ratingScore * STARS_PER_POINT;
}

export function averageOfCriteria(criteria: Record<RatingCriterion, number>) {
  const total = RATING_CRITERIA.reduce((sum, criterion) => sum + criteria[criterion], 0);

  return total / RATING_CRITERIA.length;
}

export function summarizeCriteria(criteria: Record<RatingCriterion, number>) {
  return RATING_CRITERIA.map(
    (criterion) => `${RATING_CRITERION_LABEL[criterion]} ${criteria[criterion]}`
  ).join(' · ');
}

export function formatRatingScore(ratingScore: number) {
  return ratingScore.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

export enum RatingActionStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  DONE = 'done',
  UNAVAILABLE = 'unavailable',
}

export enum RatingStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
}
