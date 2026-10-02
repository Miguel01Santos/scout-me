'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function ProfileSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <div className="flex items-center justify-between">
        <Skeleton className={`h-4 w-16 ${themeClasses.skeleton}`} />
        <Skeleton className={`h-6 w-16 rounded-full ${themeClasses.skeleton}`} />
      </div>

      <div className="space-y-3">
        {[0, 1].map((field) => (
          <div key={field} className="space-y-1.5">
            <Skeleton className={`h-2.5 w-10 ${themeClasses.skeleton}`} />
            <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
          </div>
        ))}
      </div>

      <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
    </div>
  );
}
