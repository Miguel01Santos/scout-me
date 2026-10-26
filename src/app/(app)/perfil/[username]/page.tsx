import { VisitorProfile } from './visitor-profile';

export default async function VisitorProfilePage({ params }: PageProps<'/perfil/[username]'>) {
  const { username } = await params;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <VisitorProfile username={decodeURIComponent(username)} />
    </main>
  );
}
