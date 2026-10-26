'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function FollowRequestsSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-3">
      {[0, 1].map((row) => (
        <div key={row} className={`flex items-center gap-3 p-3 border rounded-2xl ${themeClasses.card}`}>
          <Skeleton className={`size-10 shrink-0 rounded-full ${themeClasses.skeleton}`} />
          <div className="flex-1 space-y-1.5">
            <Skeleton className={`h-3.5 w-28 ${themeClasses.skeleton}`} />
            <Skeleton className={`h-3 w-20 ${themeClasses.skeleton}`} />
          </div>
          <Skeleton className={`h-7 w-32 rounded-lg ${themeClasses.skeleton}`} />
        </div>
      ))}
    </div>
  );
}
