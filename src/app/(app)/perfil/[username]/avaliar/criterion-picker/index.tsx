'use client';

import { RATING_MAX, RATING_MIN } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { CriterionPickerProps } from './type';

const SCORES = Array.from({ length: RATING_MAX - RATING_MIN + 1 }, (_, index) => RATING_MIN + index);

export function CriterionPicker({ label, value, isDisabled, onChange }: CriterionPickerProps) {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400">{label}</span>
        <span className="text-xs font-black text-amber-400">{value ?? '–'}</span>
      </div>
      <div role="group" aria-label={label} className="grid grid-cols-10 gap-1">
        {SCORES.map((score) => {
          const isSelected = score === value;

          return (
            <button
              key={score}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${label} ${score}`}
              disabled={isDisabled}
              onClick={() => onChange(score)}
              className={`h-8 rounded-lg border text-xs font-bold transition disabled:opacity-50 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : `${themeClasses.input} ${themeClasses.subText} hover:opacity-80`
              }`}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );
}
