'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { DialogComponent } from '@/src/core/library/dialog';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function DeleteAccountButton() {
  const themeClasses = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        fullWidth
        className="bg-transparent border-red-500! text-red-500!"
        onPress={() => setIsOpen(true)}
      >
        Excluir conta
      </Button>

      {/* TODO: a exclusão ainda não foi definida; por enquanto confirmar só fecha o diálogo. */}
      <DialogComponent
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className={themeClasses.bg}
        title="Excluir conta"
        body={<p>Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.</p>}
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button slot="close" variant="danger">
              Excluir
            </Button>
          </>
        }
      />
    </>
  );
}
