'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from '@heroui/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { searchProfiles } from '@/src/core/api/profiles/service';
import { PlayerSearchFilters, ProfileCard, ProfileSearchFilter } from '@/src/core/api/profiles/type';
import {
  getRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
} from '@/src/core/api/recent-searches/service';
import { RecentSearch } from '@/src/core/api/recent-searches/type';
import { getSession } from '@/src/core/auth';
import { ProfileResult } from '@/src/core/components/profile-result';
import { ProfileResultsSkeleton } from '@/src/core/components/profile-results-skeleton';
import { TextField } from '@/src/core/components/text-field';
import { DiscoverFilter } from '@/src/core/enums/discover-filter';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { AdvancedFilters } from '../advanced-filters';
import {
  ADVANCED_FILTER_ACCOUNT_TYPES,
  DISCOVER_FILTER_ACCOUNT_TYPES,
  DISCOVER_FILTERS,
  EMPTY_PLAYER_FILTERS,
} from '../constants';
import { DiscoverFilters } from '../discover-filters';
import { RecentSearches } from '../recent-searches';
import { ProfileSearchStatus } from './type';

const SEARCH_DELAY_MS = 300;
const SEARCH_MIN_LENGTH = 2;

function countActiveFilters(filters: PlayerSearchFilters) {
  return Object.values(filters).filter(Boolean).length;
}

export function ProfileSearch() {
  const themeClasses = useThemeClasses();
  const { account } = useAccount();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(DiscoverFilter.ALL);
  const [playerFilters, setPlayerFilters] = useState(EMPTY_PLAYER_FILTERS);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [results, setResults] = useState<ProfileCard[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[] | null>(null);
  const [status, setStatus] = useState<ProfileSearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRequestRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getRecentSearches(session.accessToken)
      .then(({ searches }) => setRecentSearches(searches))
      .catch(() => setRecentSearches([]));
  }, []);

  function rememberProfile(username: string) {
    const session = getSession();

    if (session) saveRecentSearch(session.accessToken, username).catch(() => undefined);
  }

  function forgetProfile(username: string) {
    const session = getSession();

    if (!session || !recentSearches) return;

    const previousSearches = recentSearches;

    setRecentSearches(previousSearches.filter((search) => search.username !== username));
    removeRecentSearch(session.accessToken, username).catch(() => {
      setRecentSearches(previousSearches);
      toast.danger('Não foi possível remover. Tente novamente.');
    });
  }

  async function runSearch(
    term: string,
    searchFilter: ProfileSearchFilter,
    filters: PlayerSearchFilters,
    requestId: number
  ) {
    const session = getSession();

    if (!session) return;

    try {
      const { profiles } = await searchProfiles(session.accessToken, {
        search: term,
        filter: searchFilter,
        ...filters,
      });

      if (latestRequestRef.current !== requestId) return;

      setResults(profiles);
      setStatus('ready');
    } catch (error) {
      if (latestRequestRef.current !== requestId) return;

      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível buscar agora.');
      setStatus('error');
    }
  }

  function startSearch(
    value: string,
    nextFilter: DiscoverFilter,
    filters: PlayerSearchFilters,
    delay: number
  ) {
    const term = value.trim();
    const requestId = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    setErrorMessage('');

    if (timerRef.current) clearTimeout(timerRef.current);

    if (
      nextFilter === DiscoverFilter.LOCATIONS ||
      (countActiveFilters(filters) === 0 && term.replace(/^@/, '').length < SEARCH_MIN_LENGTH)
    ) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    timerRef.current = setTimeout(() => runSearch(term, nextFilter, filters, requestId), delay);
  }

  function handleChange(value: string) {
    setQuery(value);
    startSearch(value, filter, playerFilters, SEARCH_DELAY_MS);
  }

  function handleFilterChange(nextFilter: DiscoverFilter) {
    if (nextFilter === filter) return;

    setFilter(nextFilter);
    startSearch(query, nextFilter, playerFilters, 0);
  }

  function handlePlayerFiltersChange(nextFilters: PlayerSearchFilters) {
    setPlayerFilters(nextFilters);
    startSearch(query, filter, nextFilters, 0);
  }

  const canUseAdvancedFilters = Boolean(
    account?.type && ADVANCED_FILTER_ACCOUNT_TYPES.includes(account.type)
  );
  const activeFiltersCount = countActiveFilters(playerFilters);

  const hint = DISCOVER_FILTERS.find((option) => option.value === filter)?.hint;
  const recentAccountTypes = DISCOVER_FILTER_ACCOUNT_TYPES[filter];
  const visibleRecentSearches = (recentSearches ?? []).filter(
    (search) => !recentAccountTypes || (search.type !== null && recentAccountTypes.includes(search.type))
  );

  function renderIdle() {
    const hintText = <p className={`text-sm ${themeClasses.subText}`}>{hint}</p>;

    if (filter === DiscoverFilter.LOCATIONS || query.trim()) return hintText;
    if (!recentSearches) return <ProfileResultsSkeleton />;
    if (visibleRecentSearches.length === 0) return hintText;

    return (
      <RecentSearches
        searches={visibleRecentSearches}
        onSelect={rememberProfile}
        onRemove={forgetProfile}
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <TextField
            label="Buscar perfis"
            type="search"
            inputClassName={themeClasses.input}
            value={query}
            onChange={handleChange}
            placeholder="Nome ou @usuário"
            autoComplete="off"
            action={<Search size={16} className={`mr-2 ${themeClasses.subText}`} />}
          />
        </div>

        {canUseAdvancedFilters && (
          <button
            type="button"
            aria-expanded={isAdvancedOpen}
            onClick={() => setIsAdvancedOpen((isOpen) => !isOpen)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition hover:opacity-80 ${
              isAdvancedOpen || activeFiltersCount > 0
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : `${themeClasses.input} ${themeClasses.subText}`
            }`}
          >
            <SlidersHorizontal size={16} className="shrink-0" />
            Filtros avançados
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-white px-1.5 text-[10px] leading-4 text-indigo-600">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {canUseAdvancedFilters && isAdvancedOpen && (
        <AdvancedFilters value={playerFilters} onChange={handlePlayerFiltersChange} />
      )}

      <DiscoverFilters value={filter} onChange={handleFilterChange} />

      {status === 'idle' && renderIdle()}

      {status === 'loading' && <ProfileResultsSkeleton />}

      {status === 'error' && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {status === 'ready' &&
        (results.length === 0 ? (
          <p className={`text-sm italic ${themeClasses.subText}`}>Nenhum perfil encontrado.</p>
        ) : (
          <div className="space-y-3">
            {results.map((profile) => (
              <ProfileResult
                key={profile.username}
                profile={profile}
                onSelect={() => rememberProfile(profile.username)}
              />
            ))}
          </div>
        ))}
    </section>
  );
}
