import { searchProfilesSchema } from './schema.js';
import { followProfile, getPublicProfile, searchProfiles, unfollowProfile } from './service.js';

export async function search(request, response) {
  const { search: term } = searchProfilesSchema.parse(request.query);
  const profiles = await searchProfiles(request.userId, term);

  return response.status(200).json({ profiles });
}

export async function show(request, response) {
  const profile = await getPublicProfile(request.userId, request.params.username);

  return response.status(200).json({ profile });
}

export async function follow(request, response) {
  const profile = await followProfile(request.userId, request.params.username);

  return response.status(200).json({ profile });
}

export async function unfollow(request, response) {
  const profile = await unfollowProfile(request.userId, request.params.username);

  return response.status(200).json({ profile });
}
