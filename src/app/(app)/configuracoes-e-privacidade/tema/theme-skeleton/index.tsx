'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function ThemeSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl ${themeClasses.card}`}>
      <Skeleton className={`h-3.5 w-36 mb-4 ${themeClasses.skeleton}`} />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((option) => (
          <Skeleton key={option} className={`h-9 rounded-xl ${themeClasses.skeleton}`} />
        ))}
      </div>
    </div>
  );
}
