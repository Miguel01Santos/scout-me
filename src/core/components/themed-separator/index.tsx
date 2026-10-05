'use client';

import { Separator } from '@heroui/react';
import { useThemeClasses } from '../../hooks/use-theme-classes';

export function ThemedSeparator() {
  const themeClasses = useThemeClasses();

  return <Separator className={themeClasses.divider} />;
}
