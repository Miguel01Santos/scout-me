'use client';

import { FormEvent, useState } from 'react';
import { ApiError } from '@/src/core/api';
import { changePassword } from '@/src/core/api/user/service';
import { getSession } from '@/src/core/auth';
import { useSession } from '@/src/core/auth/use-session';
import { TextField } from '@/src/core/components/text-field';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { validateNewPassword } from '@/src/core/utils/validate-password';
import { ResetPasswordSkeleton } from '../reset-password-skeleton';

function ResetPasswordFields() {
  const themeClasses = useThemeClasses();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({ newPassword: false, confirmPassword: false });
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPasswordError = touched.newPassword ? validateNewPassword(newPassword) : undefined;
  const confirmPasswordError =
    touched.confirmPassword && confirmPassword !== newPassword
      ? 'As senhas não coincidem'
      : undefined;
  const canSubmit =
    currentPassword.length > 0 &&
    !validateNewPassword(newPassword) &&
    confirmPassword === newPassword &&
    !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setFeedback(null);
    setIsSubmitting(true);

    try {
      const session = getSession();

      if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

      await changePassword(session.accessToken, { currentPassword, newPassword });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTouched({ newPassword: false, confirmPassword: false });
      setFeedback({ message: 'Senha alterada com sucesso.', isError: false });
    } catch (error) {
      setFeedback({
        message:
          error instanceof ApiError || error instanceof Error
            ? error.message
            : 'Erro inesperado. Tente novamente.',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}
      >
        <h2 className="text-sm font-black m-0 leading-6">Redefinir senha</h2>

        {feedback && (
          <p
            className={`rounded-xl border p-3 text-[11px] font-semibold ${
              feedback.isError
                ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className="space-y-3">
          <TextField
            label="Senha atual"
            type="password"
            inputClassName={themeClasses.input}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
          />
          <TextField
            label="Nova senha"
            type="password"
            inputClassName={themeClasses.input}
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setTouched((current) => ({ ...current, newPassword: true }));
            }}
            error={newPasswordError}
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar nova senha"
            type="password"
            inputClassName={themeClasses.input}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setTouched((current) => ({ ...current, confirmPassword: true }));
            }}
            error={confirmPasswordError}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 bg-indigo-600 enabled:hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      <p className={`text-center text-xs ${themeClasses.subText}`}>Não lembro minha senha</p>
    </>
  );
}

export function ResetPasswordForm() {
  const { user } = useSession();

  if (!user) return <ResetPasswordSkeleton />;

  return <ResetPasswordFields />;
}
