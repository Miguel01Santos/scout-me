'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { searchProfiles } from '@/src/core/api/profiles/service';
import { ProfileCard, ProfileSearchFilter } from '@/src/core/api/profiles/type';
import { getSession } from '@/src/core/auth';
import { TextField } from '@/src/core/components/text-field';
import { DiscoverFilter } from '@/src/core/enums/discover-filter';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DISCOVER_FILTERS } from '../constants';
import { DiscoverFilters } from '../discover-filters';
import { ProfileResult } from '../profile-result';
import { ProfileResultsSkeleton } from '../profile-results-skeleton';
import { ProfileSearchStatus } from './type';

const SEARCH_DELAY_MS = 300;
const SEARCH_MIN_LENGTH = 2;

export function ProfileSearch() {
  const themeClasses = useThemeClasses();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(DiscoverFilter.ALL);
  const [results, setResults] = useState<ProfileCard[]>([]);
  const [status, setStatus] = useState<ProfileSearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRequestRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  async function runSearch(term: string, searchFilter: ProfileSearchFilter, requestId: number) {
    const session = getSession();

    if (!session) return;

    try {
      const { profiles } = await searchProfiles(session.accessToken, term, searchFilter);

      if (latestRequestRef.current !== requestId) return;

      setResults(profiles);
      setStatus('ready');
    } catch (error) {
      if (latestRequestRef.current !== requestId) return;

      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível buscar agora.');
      setStatus('error');
    }
  }

  function startSearch(value: string, nextFilter: DiscoverFilter, delay: number) {
    const term = value.trim();
    const requestId = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    setErrorMessage('');

    if (timerRef.current) clearTimeout(timerRef.current);

    if (
      nextFilter === DiscoverFilter.LOCATIONS ||
      term.replace(/^@/, '').length < SEARCH_MIN_LENGTH
    ) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    timerRef.current = setTimeout(() => runSearch(term, nextFilter, requestId), delay);
  }

  function handleChange(value: string) {
    setQuery(value);
    startSearch(value, filter, SEARCH_DELAY_MS);
  }

  function handleFilterChange(nextFilter: DiscoverFilter) {
    if (nextFilter === filter) return;

    setFilter(nextFilter);
    startSearch(query, nextFilter, 0);
  }

  const hint = DISCOVER_FILTERS.find((option) => option.value === filter)?.hint;

  return (
    <section className="space-y-4">
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

      <DiscoverFilters value={filter} onChange={handleFilterChange} />

      {status === 'idle' && <p className={`text-sm ${themeClasses.subText}`}>{hint}</p>}

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
              <ProfileResult key={profile.username} profile={profile} />
            ))}
          </div>
        ))}
    </section>
  );
}
