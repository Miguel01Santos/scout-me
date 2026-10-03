'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function ProfileSummarySkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className={`size-24 shrink-0 rounded-full ${themeClasses.skeleton}`} />
        <div className="space-y-2">
          <Skeleton className={`h-5 w-40 ${themeClasses.skeleton}`} />
          <Skeleton className={`h-3.5 w-48 ${themeClasses.skeleton}`} />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-3.5 w-full ${themeClasses.skeleton}`} />
        <Skeleton className={`h-3.5 w-2/3 ${themeClasses.skeleton}`} />
      </div>
    </div>
  );
}
