import { AccountType } from '../account/constants.js';

export const RatingCriterion = {
  TECHNIQUE: 'technique',
  TACTICS: 'tactics',
  PHYSICAL: 'physical',
  CREATIVITY: 'creativity',
  EVOLUTION: 'evolution',
};

export const RATING_CRITERIA = Object.values(RatingCriterion);

export const RATING_MIN = 1;
export const RATING_MAX = 10;

export const RATING_WEIGHTS = {
  [AccountType.PLAYER]: 1,
  [AccountType.SCOUT]: 2,
  [AccountType.ORGANIZATION]: 3,
};

export const PUBLIC_RATER_TYPES = [AccountType.PLAYER, AccountType.SCOUT];
export const PRIVATE_RATER_TYPES = [AccountType.SCOUT];
export const RATED_TYPE = AccountType.PLAYER;

export const RATING_REQUESTER_TYPE = AccountType.PLAYER;
export const RATING_REQUEST_TARGET_TYPE = AccountType.SCOUT;

export const DEFAULT_RATING_SCORE = 1;
export const TYPES_WITH_DEFAULT_RATING_SCORE = [AccountType.PLAYER, AccountType.SCOUT];

export const PlayerLevel = {
  COMMON: 'common',
  POTENTIAL: 'potential',
  PROMISING: 'promising',
};

export const PLAYER_LEVEL_SCORE_RANGES = {
  [PlayerLevel.COMMON]: { lt: 7 },
  [PlayerLevel.POTENTIAL]: { gte: 7, lt: 8.5 },
  [PlayerLevel.PROMISING]: { gte: 8.5 },
};

export const RatingActionStatus = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  DONE: 'done',
  UNAVAILABLE: 'unavailable',
};

export const RatingStatus = {
  PENDING: 'pending',
  PUBLISHED: 'published',
  HIDDEN: 'hidden',
};

export const MAX_RATING_SCORE = 10;
export const SCOUT_RATINGS_PER_STEP = 5;
export const SCOUT_SCORE_STEP = 1;
