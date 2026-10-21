import { PageHeader } from '@/src/core/components/page-header';
import { EditProfileForm } from './edit-profile-form';

// Logo depois de escolher o tipo de conta, a tela anterior no histórico é o login ou o
// cadastro; nesse caso o voltar vai direto para a home.
export default async function EditProfilePage({ searchParams }: PageProps<'/perfil/editar'>) {
  const { origem } = await searchParams;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader
        title="Editar perfil"
        backHref={origem === 'tipo-de-conta' ? '/home' : undefined}
      />
      <EditProfileForm />
    </main>
  );
}
