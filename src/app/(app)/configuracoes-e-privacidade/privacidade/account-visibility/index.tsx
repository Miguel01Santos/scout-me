'use client';

import { useState } from 'react';
import { Label, Switch } from '@heroui/react';
import { useSession } from '@/src/core/auth/use-session';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { AccountVisibilitySkeleton } from '../account-visibility-skeleton';

export function AccountVisibility() {
  const { user } = useSession();
  const { account, isLoading, updateAccount } = useAccount();
  const themeClasses = useThemeClasses();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function saveVisibility(isPrivate: boolean) {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateAccount({ isPrivate });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!user || isLoading) return <AccountVisibilitySkeleton />;

  const isPrivate = account?.isPrivate ?? true;

  return (
    <section className={`p-4 border rounded-2xl space-y-3 ${themeClasses.card}`}>
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <Switch
        className="w-full justify-between"
        isSelected={isPrivate}
        isDisabled={isSaving}
        onChange={saveVisibility}
      >
        <Switch.Content className="w-full justify-between text-inherit!">
          <span className="flex flex-col gap-1">
            <Label className="text-sm font-black text-inherit!">Conta privada</Label>
            <span className={`text-[11px] ${themeClasses.subText}`}>
              {isPrivate
                ? 'Desative para deixar sua conta pública.'
                : 'Ative para deixar sua conta privada.'}
            </span>
          </span>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </section>
  );
}
