'use client';

import { useMemo } from 'react';
import { formatRatingScore } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { mcdmRank } from '../analytics';
import { McdmRankTabProps } from './type';

export function McdmRankTab({ athletes, onSelect }: McdmRankTabProps) {
  const themeClasses = useThemeClasses();
  const ranking = useMemo(() => mcdmRank(athletes), [athletes]);

  return (
    <div className="space-y-2">
      <p className={`mb-2 text-[11px] ${themeClasses.subText}`}>
        Ranking multicritério: overall (50%), solidez pela quantidade de avaliações (25%) e potencial
        pela categoria (25%).
      </p>
      {ranking.map(({ athlete, index, trend }, position) => (
        <button
          key={athlete.username}
          type="button"
          onClick={() => onSelect(athlete.username)}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition ${themeClasses.card} ${themeClasses.cardHover}`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-500">#{position + 1}</span>
              <h4 className="truncate text-xs font-bold">{getDisplayName(athlete.name, athlete)}</h4>
            </div>
            <p className={`mt-0.5 text-[10px] ${themeClasses.subText}`}>
              Tendência: <span className="font-semibold text-indigo-400">{trend.label}</span>
            </p>
            <p className={`text-[10px] ${themeClasses.subText}`}>
              Avaliações públicas:{' '}
              <span className="font-semibold text-emerald-400">{athlete.publicRatingsCount}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="block font-mono text-base font-black text-indigo-400">
              {formatRatingScore(index)}
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400">Índice MCDM</span>
          </div>
        </button>
      ))}
    </div>
  );
}
