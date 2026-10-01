'use client';

import { useAccount } from '../../providers/account';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { AppShellProps } from './type';

export function AppShell({ children }: AppShellProps) {
  const { isLoading } = useAccount();
  const themeClasses = useThemeClasses();

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${themeClasses.bg}`}>
      {/* Só renderiza o conteúdo com o tema definitivo, para não piscar no tema padrão. */}
      {!isLoading && children}
    </div>
  );
}
