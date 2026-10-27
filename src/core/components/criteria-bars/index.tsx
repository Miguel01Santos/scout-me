'use client';

import {
  RATING_CRITERIA,
  RATING_CRITERION_LABEL,
  RATING_MAX,
  formatRatingScore,
} from '../../enums/rating';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { CriteriaBarsProps } from './type';

export function CriteriaBars({ criteria }: CriteriaBarsProps) {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-1.5">
      {RATING_CRITERIA.map((criterion) => (
        <div key={criterion} className="flex items-center justify-between gap-3 text-xs">
          <span className={themeClasses.subText}>{RATING_CRITERION_LABEL[criterion]}</span>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-28 overflow-hidden rounded-full ${themeClasses.skeleton}`}>
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${(criteria[criterion] / RATING_MAX) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right font-mono font-bold">
              {formatRatingScore(criteria[criterion])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
