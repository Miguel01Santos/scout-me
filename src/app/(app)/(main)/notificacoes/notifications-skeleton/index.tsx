'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function NotificationsSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className={`flex items-start gap-3 p-3 border rounded-2xl ${themeClasses.card}`}>
          <Skeleton className={`size-10 shrink-0 rounded-full ${themeClasses.skeleton}`} />
          <div className="flex-1 space-y-1.5">
            <Skeleton className={`h-3.5 w-32 ${themeClasses.skeleton}`} />
            <Skeleton className={`h-3 w-full ${themeClasses.skeleton}`} />
            <Skeleton className={`h-2.5 w-16 ${themeClasses.skeleton}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
