import { PageHeader } from '@/src/core/components/page-header';
import { ThemeForm } from './theme-form';

export default function ThemePage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Tema" />
      <ThemeForm />
    </main>
  );
}
