'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function EditProfileSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <Skeleton className={`size-24 rounded-full ${themeClasses.skeleton}`} />

      <div className="space-y-1.5">
        <Skeleton className={`h-2.5 w-24 ${themeClasses.skeleton}`} />
        <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
      </div>

      <div className="space-y-1.5">
        <Skeleton className={`h-2.5 w-16 ${themeClasses.skeleton}`} />
        <Skeleton className={`h-20 w-full rounded-xl ${themeClasses.skeleton}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-2.5 w-24 ${themeClasses.skeleton}`} />
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((swatch) => (
            <Skeleton key={swatch} className={`size-8 rounded-full ${themeClasses.skeleton}`} />
          ))}
        </div>
      </div>

      <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
      <Skeleton className={`h-9 w-full rounded-xl ${themeClasses.skeleton}`} />
    </div>
  );
}
