'use client';

import { useMemo, useState } from 'react';
import { RATING_CRITERION_LABEL, formatRatingScore } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { compareAthletes } from '../analytics';
import { HeadToHeadTabProps } from './type';

function formatValue(value: number | null) {
  return value === null ? '–' : formatRatingScore(value);
}

function formatDelta(delta: number) {
  return delta > 0 ? `+${formatRatingScore(delta)}` : formatRatingScore(delta);
}

export function HeadToHeadTab({ athletes }: HeadToHeadTabProps) {
  const themeClasses = useThemeClasses();
  const [firstUsername, setFirstUsername] = useState(athletes[0]?.username ?? '');
  const [secondUsername, setSecondUsername] = useState(athletes[1]?.username ?? athletes[0]?.username ?? '');
  const first = athletes.find((athlete) => athlete.username === firstUsername);
  const second = athletes.find((athlete) => athlete.username === secondUsername);
  const comparison = useMemo(
    () => (first && second ? compareAthletes(first, second) : null),
    [first, second]
  );

  if (athletes.length < 2) {
    return (
      <p className={`text-sm italic ${themeClasses.subText}`}>
        Siga pelo menos 2 players para comparar.
      </p>
    );
  }

  const selects = [
    { label: 'Atleta A', value: firstUsername, onChange: setFirstUsername },
    { label: 'Atleta B', value: secondUsername, onChange: setSecondUsername },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-2">
        {selects.map((select) => (
          <label key={select.label} className="block">
            <span className={`mb-1 block text-[10px] font-bold uppercase ${themeClasses.subText}`}>
              {select.label}
            </span>
            <select
              value={select.value}
              onChange={(event) => select.onChange(event.target.value)}
              className={`w-full rounded-xl border p-2 font-bold ${themeClasses.input}`}
            >
              {athletes.map((athlete) => (
                <option key={athlete.username} value={athlete.username}>
                  {getDisplayName(athlete.name, athlete)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {comparison && first && second && (
        <div className={`space-y-3 rounded-2xl border p-4 ${themeClasses.card}`}>
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/30 pb-2">
            <span className="truncate font-bold">{getDisplayName(first.name, first)}</span>
            <span className="shrink-0 rounded bg-amber-500/10 px-2 py-0.5 font-mono font-bold text-amber-500">
              Gap: {formatDelta(comparison.scoreGap)}
            </span>
            <span className="truncate text-right font-bold">{getDisplayName(second.name, second)}</span>
          </div>

          <div className="space-y-2">
            {comparison.criteria.map((item) => (
              <div key={item.criterion} className="flex items-center justify-between text-[11px]">
                <span className="w-1/3 font-semibold">{RATING_CRITERION_LABEL[item.criterion]}</span>
                <span className="w-1/6 text-center font-mono font-bold text-indigo-400">
                  {formatValue(item.first)}
                </span>
                <span
                  className={`w-1/3 rounded px-1 py-0.5 text-center text-[10px] font-bold ${
                    item.delta === null || item.delta === 0
                      ? 'bg-slate-500/10 text-slate-400'
                      : item.delta > 0
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {item.delta === null ? 'Sem dados' : item.delta === 0 ? 'Empate' : formatDelta(item.delta)}
                </span>
                <span className="w-1/6 text-center font-mono font-bold text-purple-400">
                  {formatValue(item.second)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
