import { Building2, LayoutGrid, MapPin, Users } from 'lucide-react';
import { PlayerSearchFilters } from '@/src/core/api/profiles/type';
import { AccountType } from '@/src/core/enums/account-type';
import { DiscoverFilter } from '@/src/core/enums/discover-filter';
import { DiscoverFilterOption } from './discover-filters/type';

export const DISCOVER_FILTERS: DiscoverFilterOption[] = [
  {
    value: DiscoverFilter.ALL,
    label: 'Todos',
    icon: LayoutGrid,
    hint: 'Busque atletas, olheiros, times e organizações pelo nome ou pelo @usuário.',
  },
  {
    value: DiscoverFilter.USERS,
    label: 'Usuários',
    icon: Users,
    hint: 'Busque atletas e olheiros pelo nome ou pelo @usuário.',
  },
  {
    value: DiscoverFilter.ACCOUNTS,
    label: 'Contas',
    icon: Building2,
    hint: 'Busque times e organizações pelo nome ou pelo @usuário.',
  },
  {
    value: DiscoverFilter.LOCATIONS,
    label: 'Localizações',
    icon: MapPin,
    hint: 'Em breve você vai poder buscar locais de jogos e treinos.',
  },
];

export const DISCOVER_FILTER_ACCOUNT_TYPES: Partial<Record<DiscoverFilter, AccountType[]>> = {
  [DiscoverFilter.USERS]: [AccountType.PLAYER, AccountType.SCOUT],
  [DiscoverFilter.ACCOUNTS]: [AccountType.TEAM, AccountType.ORGANIZATION],
};

export const EMPTY_PLAYER_FILTERS: PlayerSearchFilters = {
  position: null,
  preferredFoot: null,
  category: null,
  level: null,
};

export const ADVANCED_FILTER_ACCOUNT_TYPES = [AccountType.SCOUT, AccountType.TEAM];
