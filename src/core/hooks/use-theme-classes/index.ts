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
    skeleton: darkMode ? 'bg-slate-800' : 'bg-slate-200',
    popover: darkMode
      ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-2xl shadow-black/60'
      : 'bg-white border-slate-200 text-slate-900 shadow-2xl shadow-slate-900/20',
    divider: darkMode ? 'bg-slate-700' : 'bg-slate-200',
    input: darkMode
      ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-600'
      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400',
  };
}
