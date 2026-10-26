import { LucideIcon } from 'lucide-react';
import { DiscoverFilter } from '@/src/core/enums/discover-filter';

export interface DiscoverFilterOption {
  value: DiscoverFilter;
  label: string;
  icon: LucideIcon;
  hint: string;
}

export interface DiscoverFiltersProps {
  value: DiscoverFilter;
  onChange: (filter: DiscoverFilter) => void;
}
