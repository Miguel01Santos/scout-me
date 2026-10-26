import { Building2, LayoutGrid, MapPin, Users } from 'lucide-react';
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
