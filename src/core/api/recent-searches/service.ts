import { del, get, postAuthenticated } from '../index';
import { RecentSearch } from './type';

function recentSearchPath(username: string) {
  return `/recent-searches/${encodeURIComponent(username)}`;
}

export function getRecentSearches(accessToken: string) {
  return get<{ searches: RecentSearch[] }>('/recent-searches', accessToken);
}

export function saveRecentSearch(accessToken: string, username: string) {
  return postAuthenticated<null>(recentSearchPath(username), accessToken);
}

export function removeRecentSearch(accessToken: string, username: string) {
  return del<null>(recentSearchPath(username), accessToken);
}
