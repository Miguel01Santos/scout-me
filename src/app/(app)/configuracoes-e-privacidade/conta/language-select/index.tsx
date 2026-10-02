'use client';

import { useState } from 'react';
import { Label, ListBox, Select } from '@heroui/react';
import { Language, LANGUAGE_NAME } from '@/src/core/enums/language';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { LanguageSkeleton } from '../language-skeleton';

export function LanguageSelect() {
  const { configuration, isLoading, updateConfiguration } = useAccount();
  const themeClasses = useThemeClasses();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function saveLanguage(language: Language) {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateConfiguration({ language });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <LanguageSkeleton />;

  return (
    <section className={`p-4 border rounded-2xl space-y-3 ${themeClasses.card}`}>
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <Select
        fullWidth
        className="gap-2"
        isDisabled={isSaving}
        value={configuration.language}
        onChange={(key) => saveLanguage(key as Language)}
      >
        <Label>Linguagem da conta</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {Object.values(Language).map((language) => (
              <ListBox.Item key={language} id={language} textValue={LANGUAGE_NAME[language]}>
                {LANGUAGE_NAME[language]}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </section>
  );
}
