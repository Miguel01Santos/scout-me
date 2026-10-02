'use client';

import { useEffect } from 'react';
import { useDarkMode } from '../../hooks/use-dark-mode';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { AppShellProps } from './type';

export function AppShell({ children }: AppShellProps) {
  const themeClasses = useThemeClasses();
  const darkMode = useDarkMode();

  // Drawers e modais do HeroUI renderizam num portal fora deste componente; o tema
  // precisa estar no <html> para eles também seguirem a preferência do usuário.
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${themeClasses.bg}`}>
      {children}
    </div>
  );
}
