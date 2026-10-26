'use client';

import { Button } from '@heroui/react';
import { DialogComponent } from '@/src/core/library/dialog';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogUnfollowProps } from './type';

export function DialogUnfollow({
  isOpen,
  onOpenChange,
  name,
  isPrivate,
  onConfirm,
}: DialogUnfollowProps) {
  const themeClasses = useThemeClasses();

  return (
    <DialogComponent
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={themeClasses.bg}
      title="Deixar de seguir?"
      body={
        <p>
          Você vai deixar de seguir {name}.
          {isPrivate &&
            ' A conta é privada: para ver o perfil completo de novo, você vai precisar pedir para seguir e esperar a aprovação.'}
        </p>
      }
      footer={
        <>
          <Button slot="close" variant="tertiary">
            Cancelar
          </Button>
          <Button variant="danger" onPress={onConfirm}>
            Deixar de seguir
          </Button>
        </>
      }
    />
  );
}
