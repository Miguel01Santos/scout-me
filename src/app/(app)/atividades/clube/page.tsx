import { PageHeader } from '@/src/core/components/page-header';
import { MyClubSection } from '../my-club';

export default function MyClubPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Clube" />
      <MyClubSection />
    </main>
  );
}
