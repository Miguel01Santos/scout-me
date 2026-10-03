import { PageHeader } from '@/src/core/components/page-header';
import { PolicyContent } from './policy-content';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Política de privacidade" />
      <PolicyContent />
    </main>
  );
}
