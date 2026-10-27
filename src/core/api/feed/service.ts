import { get } from '../index';
import { FeedPage } from './type';

export function getFeed(accessToken: string, before?: string) {
  const query = before ? `?before=${encodeURIComponent(before)}` : '';

  return get<FeedPage>(`/feed${query}`, accessToken);
}
