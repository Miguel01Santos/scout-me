'use client';

import { FormEvent, useState } from 'react';
import { Chip, Skeleton } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import { ApiIssue } from '@/src/core/api/type';
import { updateUser } from '@/src/core/api/user/service';
import { getSession } from '@/src/core/auth';
import { useSession } from '@/src/core/auth/use-session';
import { TextField } from '@/src/core/components/text-field';
import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME, toAccountType } from '@/src/core/enums/account-type';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { ProfileFieldsProps } from '../type';

function ProfileFields({ user }: ProfileFieldsProps) {
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const [name, setName] = useState(user.name);
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountType = toAccountType(account?.type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIssues([]);
    setIsSubmitting(true);

    try {
      const session = getSession();

      if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

      await updateUser(session.accessToken, { name });
      setFeedback({ message: 'Dados atualizados.', isError: false });
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.',
        isError: true,
      });
      setIssues(error instanceof ApiError ? error.issues : []);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black m-0">Perfil</h2>
        <Chip className={`${ACCOUNT_TYPE_COLOR[accountType].background} text-white`}>
          {ACCOUNT_TYPE_NAME[accountType]}
        </Chip>
      </div>

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
          label="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={issues.find((issue) => issue.field === 'name')?.message}
          autoComplete="name"
          required
        />
        <TextField label="E-mail" value={user.email} disabled readOnly />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || name.trim() === user.name}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export function ProfileForm() {
  const { user } = useSession();

  if (!user) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return <ProfileFields user={user} />;
}
