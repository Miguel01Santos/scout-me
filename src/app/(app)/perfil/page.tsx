import { Menu } from 'lucide-react';
import { IconLinkButton } from '@/src/core/components/icon-link-button';
import { PageHeader } from '@/src/core/components/page-header';
import { ThemedSeparator } from '@/src/core/components/themed-separator';
import { ProfileSummary } from './profile-summary';

export default function ProfilePage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader
        title="Meu Perfil"
        action={
          <IconLinkButton href="/perfil/editar" label="Editar perfil">
            <Menu size={20} />
          </IconLinkButton>
        }
      />
      <ProfileSummary />
      <ThemedSeparator />
    </main>
  );
}
