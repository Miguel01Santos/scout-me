'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function FeedSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-4">
      {[0, 1].map((item) => (
        <div key={item} className={`space-y-3 rounded-2xl border p-3 ${themeClasses.card}`}>
          <div className="flex items-center gap-3">
            <Skeleton className={`size-[35px] rounded-full ${themeClasses.skeleton}`} />
            <div className="flex-1 space-y-1.5">
              <Skeleton className={`h-3.5 w-32 ${themeClasses.skeleton}`} />
              <Skeleton className={`h-3 w-20 ${themeClasses.skeleton}`} />
            </div>
          </div>
          <Skeleton className={`aspect-[4/5] w-full rounded-2xl ${themeClasses.skeleton}`} />
        </div>
      ))}
    </div>
  );
}
