import { PageHeader } from '@/src/core/components/page-header';
import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PageHeader title="Redefinir senha" />
      <ResetPasswordForm />
    </main>
  );
}
