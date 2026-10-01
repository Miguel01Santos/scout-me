'use client';

import { useSyncExternalStore } from 'react';
import { Theme } from '../../enums/theme';
import { useAccount } from '../../providers/account';

const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystemTheme(onChange: () => void) {
  const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);

  mediaQuery.addEventListener('change', onChange);

  return () => mediaQuery.removeEventListener('change', onChange);
}

export function useDarkMode() {
  const { configuration } = useAccount();
  const isSystemDark = useSyncExternalStore(
    subscribeToSystemTheme,
    () => window.matchMedia(SYSTEM_DARK_QUERY).matches,
    () => true
  );

  return configuration.theme === Theme.SYSTEM
    ? isSystemDark
    : configuration.theme === Theme.DARK;
}
