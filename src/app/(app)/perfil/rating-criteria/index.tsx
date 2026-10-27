'use client';

import { CriteriaBars } from '@/src/core/components/criteria-bars';
import { PLAYER_LEVEL_LABEL, toPlayerLevel } from '@/src/core/enums/player-level';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { RatingCriteriaSectionProps } from './type';

export function RatingCriteriaSection({ criteria, ratingScore }: RatingCriteriaSectionProps) {
  const themeClasses = useThemeClasses();

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-sm font-black">Avaliação</h3>
        {criteria && (
          <span className={`text-xs ${themeClasses.subText}`}>
            Nível: <span className="font-bold">{PLAYER_LEVEL_LABEL[toPlayerLevel(ratingScore)]}</span>
          </span>
        )}
      </div>

      {criteria ? (
        <CriteriaBars criteria={criteria} />
      ) : (
        <p className={`text-sm italic ${themeClasses.subText}`}>Sem avaliações ainda.</p>
      )}
    </section>
  );
}
