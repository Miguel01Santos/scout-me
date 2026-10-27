import { listRecentSearches, removeRecentSearch, saveRecentSearch } from './service.js';

export async function index(request, response) {
  const searches = await listRecentSearches(request.userId);

  return response.status(200).json({ searches });
}

export async function save(request, response) {
  await saveRecentSearch(request.userId, request.params.username);

  return response.status(204).send();
}

export async function remove(request, response) {
  await removeRecentSearch(request.userId, request.params.username);

  return response.status(204).send();
}
