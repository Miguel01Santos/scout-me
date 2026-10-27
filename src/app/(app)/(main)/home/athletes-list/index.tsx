'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { PLAYER_LEVEL_LABEL, toPlayerLevel } from '@/src/core/enums/player-level';
import { formatRatingScore } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { pluralize } from '@/src/core/utils/pluralize';
import { AthleteLine } from '../athlete-line';
import { AthletesListProps } from './type';

export function AthletesList({ athletes, onSelect }: AthletesListProps) {
  const themeClasses = useThemeClasses();
  const [query, setQuery] = useState('');
  const term = query.trim().replace(/^@/, '').toLowerCase();
  const visibleAthletes = athletes.filter(
    (athlete) =>
      !term ||
      athlete.username.includes(term) ||
      getDisplayName(athlete.name, athlete).toLowerCase().includes(term)
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar atleta"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`w-full rounded-xl border p-2.5 pl-8 text-xs outline-none ${themeClasses.input}`}
        />
        <Search size={14} className={`absolute left-2.5 top-3 ${themeClasses.subText}`} />
      </div>

      <div className="flex items-center justify-between px-1 text-[11px]">
        <span className={`font-bold ${themeClasses.subText}`}>Atletas que você segue ({visibleAthletes.length})</span>
        <span className={themeClasses.subText}>Overall</span>
      </div>

      {visibleAthletes.map((athlete) => (
        <button
          key={athlete.username}
          type="button"
          onClick={() => onSelect(athlete.username)}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition ${themeClasses.card} ${themeClasses.cardHover}`}
        >
          <div className="min-w-0">
            <h3 className="truncate text-xs font-bold">{getDisplayName(athlete.name, athlete)}</h3>
            <p className={`mt-0.5 truncate text-[11px] ${themeClasses.subText}`}>
              <AthleteLine athlete={athlete} />
            </p>
            <p className={`mt-0.5 text-[10px] ${themeClasses.subText}`}>
              {athlete.ratingsCount} {pluralize(athlete.ratingsCount, 'avaliação', 'avaliações')}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="block font-mono text-lg font-black leading-tight text-amber-500">
              {formatRatingScore(athlete.ratingScore)}
            </span>
            <span className="mt-0.5 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
              {athlete.publicRatingsCount > 0
                ? PLAYER_LEVEL_LABEL[toPlayerLevel(athlete.ratingScore)]
                : 'Sem avaliações'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
