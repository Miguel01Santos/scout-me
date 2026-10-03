'use client';

import { useState } from 'react';
import { THEME_NAME } from '@/src/core/enums/theme';
import { useSession } from '@/src/core/auth/use-session';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { OptionGroup } from '../option-group';
import { ThemeSkeleton } from '../theme-skeleton';

export function ThemeForm() {
  const { user } = useSession();
  const { configuration, isLoading, updateConfiguration } = useAccount();
  const themeClasses = useThemeClasses();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function saveTheme(theme: typeof configuration.theme) {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateConfiguration({ theme });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!user || isLoading) return <ThemeSkeleton />;

  return (
    <section className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <OptionGroup
        label="Tema do aplicativo"
        value={configuration.theme}
        options={THEME_NAME}
        disabled={isSaving}
        onChange={saveTheme}
      />
    </section>
  );
}
