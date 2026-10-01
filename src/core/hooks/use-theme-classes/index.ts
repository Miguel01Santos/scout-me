'use client';

import { useDarkMode } from '../use-dark-mode';
import { ThemeClasses } from './type';

export function useThemeClasses(): ThemeClasses {
  const darkMode = useDarkMode();

  return {
    bg: darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
    card: darkMode
      ? 'bg-slate-900/90 border-slate-800'
      : 'bg-white border-slate-200 shadow-sm',
    cardHover: darkMode ? 'hover:border-slate-700' : 'hover:border-slate-300',
    subText: darkMode ? 'text-slate-400' : 'text-slate-500',
  };
}
