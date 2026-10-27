'use client';

import { useMemo, useState } from 'react';
import { Target } from 'lucide-react';
import { RATING_CRITERIA, RATING_CRITERION_LABEL, formatRatingScore } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { DEFAULT_BLUEPRINT, tacticalFit } from '../analytics';
import { Blueprint } from '../analytics/type';
import { AthleteLine } from '../athlete-line';
import { TacticalBlueprintTabProps } from './type';

export function TacticalBlueprintTab({ athletes, onSelect }: TacticalBlueprintTabProps) {
  const themeClasses = useThemeClasses();
  const [blueprint, setBlueprint] = useState<Blueprint>(DEFAULT_BLUEPRINT);
  const rankedAthletes = useMemo(
    () =>
      athletes
        .map((athlete) => ({ athlete, fit: tacticalFit(athlete, blueprint) }))
        .sort((first, second) => (second.fit ?? -1) - (first.fit ?? -1)),
    [athletes, blueprint]
  );

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${themeClasses.card}`}>
        <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-indigo-500">
          <Target size={14} /> Blueprint de perfil ideal
        </h3>
        <p className={`mb-3 text-[11px] ${themeClasses.subText}`}>
          Ajuste o peso de cada critério para ranquear a aderência dos atletas ao esquema do time.
        </p>

        <div className="space-y-2 text-xs">
          {RATING_CRITERIA.map((criterion) => (
            <div key={criterion} className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>{RATING_CRITERION_LABEL[criterion]}</span>
                <span className="font-mono font-bold text-amber-500">
                  {(blueprint[criterion] * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={blueprint[criterion]}
                aria-label={`Peso de ${RATING_CRITERION_LABEL[criterion]}`}
                onChange={(event) =>
                  setBlueprint((current) => ({ ...current, [criterion]: Number(event.target.value) }))
                }
                className="w-full accent-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rankedAthletes.map(({ athlete, fit }, index) => (
          <button
            key={athlete.username}
            type="button"
            onClick={() => onSelect(athlete.username)}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition ${themeClasses.card} ${themeClasses.cardHover}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-xs font-black text-indigo-400">
                #{index + 1}
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-xs font-bold">{getDisplayName(athlete.name, athlete)}</h4>
                <p className={`truncate text-[11px] ${themeClasses.subText}`}>
                  <AthleteLine athlete={athlete} />
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="block font-mono text-lg font-black leading-tight text-emerald-500">
                {fit === null ? '–' : `${formatRatingScore(fit)} pts`}
              </span>
              <span className="block text-[9px] font-bold text-slate-400">
                Overall: {formatRatingScore(athlete.ratingScore)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
