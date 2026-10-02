'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function ThemeSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <Skeleton className={`h-3 w-44 ${themeClasses.skeleton}`} />
      <div className="space-y-1.5">
        <Skeleton className={`h-2.5 w-10 ${themeClasses.skeleton}`} />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((option) => (
            <Skeleton key={option} className={`h-9 rounded-xl ${themeClasses.skeleton}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
