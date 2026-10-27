import { RecentSearch } from '@/src/core/api/recent-searches/type';

export interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (username: string) => void;
  onRemove: (username: string) => void;
}
