'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function PlayerAttributesSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <div className="space-y-3">
        {[0, 1, 2].map((field) => (
          <div key={field} className="space-y-1.5">
            <Skeleton className={`h-2.5 w-24 ${themeClasses.skeleton}`} />
            <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
          </div>
        ))}
      </div>

      <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
    </div>
  );
}
