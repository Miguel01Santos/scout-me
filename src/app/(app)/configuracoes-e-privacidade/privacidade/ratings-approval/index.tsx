'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { useAccount } from '@/src/core/providers/account';
import { pluralize } from '@/src/core/utils/pluralize';
import { PrivacySwitch } from '../privacy-switch';

export function RatingsApproval() {
  const { account, updateAccount } = useAccount();
  const themeClasses = useThemeClasses();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const reviewRatings = account?.reviewRatings ?? false;
  const pendingCount = account?.pendingRatingsCount ?? 0;

  async function saveApproval(nextReviewRatings: boolean) {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await updateAccount({ reviewRatings: nextReviewRatings });
      setIsConfirmOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(nextReviewRatings: boolean) {
    if (!nextReviewRatings && pendingCount > 0) {
      setIsConfirmOpen(true);
      return;
    }

    saveApproval(nextReviewRatings);
  }

  return (
    <>
      <PrivacySwitch
        label="Aprovar avaliações"
        description={
          reviewRatings
            ? 'Novas avaliações só aparecem no seu perfil depois que você compartilhar.'
            : 'Ative para revisar as avaliações antes de aparecerem no seu perfil.'
        }
        isSelected={reviewRatings}
        isDisabled={isSaving}
        errorMessage={errorMessage}
        onChange={handleChange}
      />

      <DialogComponent
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        className={themeClasses.bg}
        title="Compartilhar avaliações pendentes?"
        body={
          <p>
            Você tem {pendingCount} {pluralize(pendingCount, 'avaliação', 'avaliações')}{' '}
            {pluralize(pendingCount, 'pendente', 'pendentes')}. Ao desativar, todas serão compartilhadas
            no seu perfil e passam a contar na sua nota.
          </p>
        }
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button onPress={() => saveApproval(false)} isDisabled={isSaving}>
              Compartilhar todas
            </Button>
          </>
        }
      />
    </>
  );
}
