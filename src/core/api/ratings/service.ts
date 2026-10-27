import { del, get, postAuthenticated } from '../index';
import { PrivateRating, RateProfileInput, RatingItem } from './type';

function profilePath(username: string) {
  return `/profiles/${encodeURIComponent(username)}`;
}

export function rateProfile(accessToken: string, username: string, input: RateProfileInput) {
  return postAuthenticated<null>(`${profilePath(username)}/ratings`, accessToken, input);
}

export function requestRating(accessToken: string, username: string, isPrivate: boolean) {
  return postAuthenticated<null>(`${profilePath(username)}/rating-requests`, accessToken, {
    isPrivate,
  });
}

export function getPrivateRatings(accessToken: string) {
  return get<{ ratings: PrivateRating[] }>('/account/me/private-ratings', accessToken);
}

export function getRating(accessToken: string, ratingId: number) {
  return get<{ rating: RatingItem }>(`/ratings/${ratingId}`, accessToken);
}

export function getReceivedRatings(accessToken: string) {
  return get<{ ratings: RatingItem[] }>('/account/me/ratings/received', accessToken);
}

export function getGivenRatings(accessToken: string) {
  return get<{ ratings: RatingItem[] }>('/account/me/ratings/given', accessToken);
}

export function cancelGivenRating(accessToken: string, ratingId: number) {
  return del<null>(`/account/me/ratings/given/${ratingId}`, accessToken);
}
