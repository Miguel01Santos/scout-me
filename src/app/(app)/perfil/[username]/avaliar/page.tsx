import { RatingForm } from './rating-form';

export default async function RateProfilePage({
  params,
  searchParams,
}: PageProps<'/perfil/[username]/avaliar'>) {
  const [{ username }, { privada }] = await Promise.all([params, searchParams]);

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <RatingForm username={decodeURIComponent(username)} isPrivate={privada === '1'} />
    </main>
  );
}
