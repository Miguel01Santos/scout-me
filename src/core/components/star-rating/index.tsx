'use client';

import { Star } from 'lucide-react';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { StarRatingProps } from './type';

const STAR_COUNT = 5;
const STAR_COLOR = '#fbbf24';

export function StarRating({ value, size = 16 }: StarRatingProps) {
  const themeClasses = useThemeClasses();
  const rating = Math.min(Math.max(value, 0), STAR_COUNT);

  return (
    <div
      role="img"
      aria-label={`Avaliação: ${rating} de ${STAR_COUNT}`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => {
        const filledPercent = Math.round(Math.min(Math.max(rating - index, 0), 1) * 100);

        return (
          <span key={index} className="relative flex" style={{ width: size, height: size }}>
            <Star size={size} fill="none" className={themeClasses.subText} />
            {filledPercent > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${filledPercent}%` }}
              >
                <Star size={size} color={STAR_COLOR} fill={STAR_COLOR} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
