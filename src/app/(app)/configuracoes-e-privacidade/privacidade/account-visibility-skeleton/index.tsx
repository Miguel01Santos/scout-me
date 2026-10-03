'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function AccountVisibilitySkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`flex items-center justify-between p-4 border rounded-2xl ${themeClasses.card}`}>
      <div className="space-y-2">
        <Skeleton className={`h-3.5 w-28 ${themeClasses.skeleton}`} />
        <Skeleton className={`h-3 w-48 ${themeClasses.skeleton}`} />
      </div>
      <Skeleton className={`h-6 w-11 rounded-full ${themeClasses.skeleton}`} />
    </div>
  );
}
