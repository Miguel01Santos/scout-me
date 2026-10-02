'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { DialogLogout } from '@/src/core/components/dialog-logout';

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger-soft" fullWidth onPress={() => setIsOpen(true)}>
        Sair da conta
      </Button>

      <DialogLogout isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
