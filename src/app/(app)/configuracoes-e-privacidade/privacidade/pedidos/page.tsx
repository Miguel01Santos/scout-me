import { PageHeader } from '@/src/core/components/page-header';
import { FollowRequestsList } from './follow-requests-list';

export default function FollowRequestsPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Pedidos para seguir" />
      <FollowRequestsList />
    </main>
  );
}
