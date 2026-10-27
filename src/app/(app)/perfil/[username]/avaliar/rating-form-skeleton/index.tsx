'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function RatingFormSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className={`size-10 rounded-full ${themeClasses.skeleton}`} />
        <div className="flex-1 space-y-1.5">
          <Skeleton className={`h-3.5 w-32 ${themeClasses.skeleton}`} />
          <Skeleton className={`h-3 w-20 ${themeClasses.skeleton}`} />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="space-y-1.5">
          <Skeleton className={`h-2.5 w-20 ${themeClasses.skeleton}`} />
          <Skeleton className={`h-8 w-full rounded-lg ${themeClasses.skeleton}`} />
        </div>
      ))}
    </div>
  );
}
