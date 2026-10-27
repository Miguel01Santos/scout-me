import { toProfileCard } from '../account/mappers.js';
import { PROFILE_CARD_INCLUDE } from '../follow/service.js';
import { CRITERIA_SELECT, toCriteria } from './score.js';

export const RATING_ITEM_SELECT = {
  id: true,
  isPrivate: true,
  status: true,
  createdAt: true,
  ...CRITERIA_SELECT,
  rater: { include: PROFILE_CARD_INCLUDE },
  rated: { include: PROFILE_CARD_INCLUDE },
};

export function toRatingItem(rating) {
  return {
    id: rating.id,
    isPrivate: rating.isPrivate,
    status: rating.status,
    createdAt: rating.createdAt,
    rater: toProfileCard(rating.rater),
    rated: toProfileCard(rating.rated),
    criteria: toCriteria(rating),
  };
}
