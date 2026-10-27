import { PlayerSearchFilters } from '@/src/core/api/profiles/type';

export interface AdvancedFiltersProps {
  value: PlayerSearchFilters;
  onChange: (filters: PlayerSearchFilters) => void;
}
