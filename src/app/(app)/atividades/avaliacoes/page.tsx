import { PageHeader } from '@/src/core/components/page-header';
import { RatingsActivity } from '../ratings-activity';

export default function RatingsActivityPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Avaliações" />
      <RatingsActivity />
    </main>
  );
}
