'use client';

import { useEffect } from 'react';
import { Toast } from '@heroui/react';
import { useDarkMode } from '../../hooks/use-dark-mode';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { useAccount } from '../../providers/account';
import { AppShellProps } from './type';

export function AppShell({ children }: AppShellProps) {
  const themeClasses = useThemeClasses();
  const darkMode = useDarkMode();
  const { isAuthenticated } = useAccount();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${themeClasses.bg}`}>
      {/* Só o fundo até confirmar a sessão, para nenhuma página aparecer antes de ir para o login. */}
      {isAuthenticated && children}
      <Toast.Provider />
    </div>
  );
}
