import { PageHeader } from '@/src/core/components/page-header';
import { EditProfileForm } from './edit-profile-form';

export default function EditProfilePage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Editar perfil" />
      <EditProfileForm />
    </main>
  );
}
