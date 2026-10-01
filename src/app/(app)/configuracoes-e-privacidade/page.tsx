import { PageHeader } from '@/src/core/components/page-header';
import { SettingsList } from './settings-list';

export default function SettingsPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Configurações e privacidade" />
      <SettingsList />
    </main>
  );
}
