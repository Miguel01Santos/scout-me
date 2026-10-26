import { PageHeader } from '@/src/core/components/page-header';
import { ThemedSeparator } from '@/src/core/components/themed-separator';
import { ProfileMenu } from './profile-menu';
import { ProfileSummary } from './profile-summary';

export default function ProfilePage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Meu Perfil" action={<ProfileMenu />} />
      <ProfileSummary />
      <ThemedSeparator />
    </main>
  );
}
