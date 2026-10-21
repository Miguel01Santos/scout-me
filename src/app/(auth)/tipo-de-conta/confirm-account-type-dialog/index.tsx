'use client';

import { Button } from '@heroui/react';
import { ACCOUNT_TYPE_NAME } from '@/src/core/enums/account-type';
import { DialogComponent } from '@/src/core/library/dialog';
import { ConfirmAccountTypeDialogProps } from './type';

export function ConfirmAccountTypeDialog({
  isOpen,
  type,
  isSaving,
  onConfirm,
  onOpenChange,
}: ConfirmAccountTypeDialogProps) {
  const typeName = type ? ACCOUNT_TYPE_NAME[type] : '';

  return (
    <DialogComponent
      isOpen={isOpen}
      onOpenChange={(nextIsOpen) => {
        if (!isSaving) onOpenChange(nextIsOpen);
      }}
      // O diálogo abre num portal, fora do layout escuro: o "dark" liga as cores escuras do HeroUI.
      className="dark bg-slate-900 text-slate-100"
      title={`Usar o ScoutMe PRO como ${typeName}?`}
      body={
        <p className="text-sm text-slate-400">
          Essa escolha define o tipo da sua conta e não poderá ser alterada depois.
        </p>
      }
      footer={
        <>
          <Button slot="close" variant="tertiary" isDisabled={isSaving}>
            Voltar
          </Button>
          <Button onPress={onConfirm} isDisabled={isSaving} className="bg-indigo-600 text-white">
            {isSaving ? 'Salvando...' : `Sou ${typeName}`}
          </Button>
        </>
      }
    />
  );
}
