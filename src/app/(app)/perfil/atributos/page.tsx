import { PlayerAttributesForm } from './player-attributes-form';

// O cabeçalho fica dentro do formulário porque o título segue o idioma da conta.
// ?origem=tipo-de-conta: o Player acabou de escolher o tipo e está terminando o cadastro.
export default async function PlayerAttributesPage({ searchParams }: PageProps<'/perfil/atributos'>) {
  const { origem } = await searchParams;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PlayerAttributesForm isOnboarding={origem === 'tipo-de-conta'} />
    </main>
  );
}
