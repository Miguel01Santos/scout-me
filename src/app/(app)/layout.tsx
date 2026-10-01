import { ReactNode } from 'react';
import { AppShell } from '@/src/core/components/app-shell';
import { AccountProvider } from '@/src/core/providers/account';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AccountProvider>
      <AppShell>{children}</AppShell>
    </AccountProvider>
  );
}
