import { PageHeader } from '@/src/core/components/page-header';
import { PendingRatingsList } from './pending-ratings-list';

export default function PendingRatingsPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Avaliações pendentes" />
      <PendingRatingsList />
    </main>
  );
}
