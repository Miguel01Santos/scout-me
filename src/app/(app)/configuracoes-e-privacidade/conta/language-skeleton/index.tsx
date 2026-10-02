'use client';

import { Skeleton } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function LanguageSkeleton() {
  const themeClasses = useThemeClasses();

  return (
    <div className={`p-4 border rounded-2xl space-y-2 ${themeClasses.card}`}>
      <Skeleton className={`h-3.5 w-36 ${themeClasses.skeleton}`} />
      <Skeleton className={`h-10 w-full rounded-xl ${themeClasses.skeleton}`} />
    </div>
  );
}
