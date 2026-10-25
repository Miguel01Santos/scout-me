import { PlayerAttributesForm } from './player-attributes-form';

// O cabeçalho fica dentro do formulário porque o título segue o idioma da conta.
export default function PlayerAttributesPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PlayerAttributesForm />
    </main>
  );
}
