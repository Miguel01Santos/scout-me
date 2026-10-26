'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { searchProfiles } from '@/src/core/api/profiles/service';
import { ProfileCard } from '@/src/core/api/profiles/type';
import { getSession } from '@/src/core/auth';
import { TextField } from '@/src/core/components/text-field';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { ProfileResult } from '../profile-result';
import { ProfileResultsSkeleton } from '../profile-results-skeleton';
import { ProfileSearchStatus } from './type';

const SEARCH_DELAY_MS = 300;
const SEARCH_MIN_LENGTH = 2;

export function ProfileSearch() {
  const themeClasses = useThemeClasses();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileCard[]>([]);
  const [status, setStatus] = useState<ProfileSearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSearchRef = useRef('');

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  async function runSearch(term: string) {
    const session = getSession();

    if (!session) return;

    try {
      const { profiles } = await searchProfiles(session.accessToken, term);

      if (latestSearchRef.current !== term) return;

      setResults(profiles);
      setStatus('ready');
    } catch (error) {
      if (latestSearchRef.current !== term) return;

      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível buscar agora.');
      setStatus('error');
    }
  }

  function handleChange(value: string) {
    const term = value.trim();

    setQuery(value);
    setErrorMessage('');
    latestSearchRef.current = term;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (term.replace(/^@/, '').length < SEARCH_MIN_LENGTH) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    timerRef.current = setTimeout(() => runSearch(term), SEARCH_DELAY_MS);
  }

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

      {status === 'idle' && (
        <p className={`text-sm ${themeClasses.subText}`}>
          Busque atletas, olheiros e times pelo nome ou pelo @usuário.
        </p>
      )}

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
