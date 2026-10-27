'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { useAccount } from '@/src/core/providers/account';
import { pluralize } from '@/src/core/utils/pluralize';
import { PrivacySwitch } from '../privacy-switch';

export function AccountVisibility() {
  const { account, updateAccount } = useAccount();
  const themeClasses = useThemeClasses();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isPrivate = account?.isPrivate ?? false;
  const pendingCount = account?.pendingFollowRequestsCount ?? 0;

  async function saveVisibility(nextIsPrivate: boolean) {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateAccount({ isPrivate: nextIsPrivate });
      setIsConfirmOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(nextIsPrivate: boolean) {
    if (!nextIsPrivate && pendingCount > 0) {
      setIsConfirmOpen(true);
      return;
    }

    saveVisibility(nextIsPrivate);
  }

  return (
    <>
      <PrivacySwitch
        label="Conta privada"
        description={
          isPrivate ? 'Desative para deixar sua conta pública.' : 'Ative para deixar sua conta privada.'
        }
        isSelected={isPrivate}
        isDisabled={isSaving}
        errorMessage={errorMessage}
        onChange={handleChange}
      />

      <DialogComponent
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        className={themeClasses.bg}
        title="Deixar a conta pública?"
        body={
          <p>
            Você tem {pendingCount} {pluralize(pendingCount, 'pedido', 'pedidos')} para seguir{' '}
            {pluralize(pendingCount, 'pendente', 'pendentes')}. Ao deixar a conta pública, todos serão
            aceitos.
          </p>
        }
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button onPress={() => saveVisibility(false)} isDisabled={isSaving}>
              Aceitar e deixar pública
            </Button>
          </>
        }
      />
    </>
  );
}
