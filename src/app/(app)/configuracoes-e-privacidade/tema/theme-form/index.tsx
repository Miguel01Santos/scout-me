'use client';

import { useState } from 'react';
import { THEME_NAME } from '@/src/core/enums/theme';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { OptionGroup } from '../option-group';

export function ThemeForm() {
  const { configuration, updateConfiguration } = useAccount();
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

  return (
    <section className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <p className={`text-[11px] ${themeClasses.subText}`}>Salvo automaticamente na sua conta.</p>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <OptionGroup
        label="Tema"
        value={configuration.theme}
        options={THEME_NAME}
        disabled={isSaving}
        onChange={saveTheme}
      />
    </section>
  );
}
