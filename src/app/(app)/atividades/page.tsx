import { PageHeader } from '@/src/core/components/page-header';
import { ActivitiesList } from './activities-list';

export default function ActivitiesPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Atividades" />
      <ActivitiesList />
    </main>
  );
}
