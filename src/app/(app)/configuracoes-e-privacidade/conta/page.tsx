import { PageHeader } from '@/src/core/components/page-header';
import { LanguageSelect } from './language-select';
import { LogoutButton } from './logout-button';
import { ProfileForm } from './profile-form';

export default function AccountSettingsPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Conta" />
      <ProfileForm />
      <LanguageSelect />
      <LogoutButton />
    </main>
  );
}
