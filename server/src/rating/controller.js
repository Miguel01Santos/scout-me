import { rateProfileSchema, ratingParamsSchema, requestRatingSchema } from './schema.js';
import {
  cancelGivenRating,
  getRating,
  hidePendingRating,
  listGivenRatings,
  listReceivedRatings,
  listPendingRatings,
  listPrivateRatings,
  publishPendingRating,
  rateProfile,
  requestRating,
} from './service.js';

export async function rate(request, response) {
  const data = rateProfileSchema.parse(request.body);

  await rateProfile(request.userId, request.params.username, data);

  return response.status(201).send();
}

export async function askForRating(request, response) {
  const data = requestRatingSchema.parse(request.body ?? {});

  await requestRating(request.userId, request.params.username, data);

  return response.status(201).send();
}

export async function privateRatings(request, response) {
  const ratings = await listPrivateRatings(request.userId);

  return response.status(200).json({ ratings });
}

export async function pendingRatings(request, response) {
  const ratings = await listPendingRatings(request.userId);

  return response.status(200).json({ ratings });
}

export async function publishRating(request, response) {
  const account = await publishPendingRating(request.userId, request.params.username);

  return response.status(200).json({ account });
}

export async function hideRating(request, response) {
  const account = await hidePendingRating(request.userId, request.params.username);

  return response.status(200).json({ account });
}

export async function show(request, response) {
  const { id } = ratingParamsSchema.parse(request.params);
  const rating = await getRating(request.userId, id);

  return response.status(200).json({ rating });
}

export async function receivedRatings(request, response) {
  const ratings = await listReceivedRatings(request.userId);

  return response.status(200).json({ ratings });
}

export async function givenRatings(request, response) {
  const ratings = await listGivenRatings(request.userId);

  return response.status(200).json({ ratings });
}

export async function cancelRating(request, response) {
  const { id } = ratingParamsSchema.parse(request.params);

  await cancelGivenRating(request.userId, id);

  return response.status(204).send();
}
