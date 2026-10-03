import { PageHeader } from '@/src/core/components/page-header';
import { PrivacyList } from './privacy-list';

export default function PrivacyPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Privacidade" />
      <PrivacyList />
    </main>
  );
}
