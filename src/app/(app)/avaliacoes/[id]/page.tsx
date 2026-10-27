import { RatingDetail } from '../rating-detail';

export default async function RatingPage({ params }: PageProps<'/avaliacoes/[id]'>) {
  const { id } = await params;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <RatingDetail ratingId={Number(id)} />
    </main>
  );
}
