import { PageHeader } from '@/src/core/components/page-header';
import { AccountSettings } from './account-settings';
import { DeleteAccountButton } from './delete-account-button';
import { LogoutButton } from './logout-button';

export default function AccountSettingsPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Conta" />
      <AccountSettings />
      <LogoutButton />
      <DeleteAccountButton />
    </main>
  );
}
