'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { Chip } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import { ApiIssue } from '@/src/core/api/type';
import { updateUser } from '@/src/core/api/user/service';
import { getSession } from '@/src/core/auth';
import { TextField } from '@/src/core/components/text-field';
import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME, toAccountType } from '@/src/core/enums/account-type';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { validateName } from '@/src/core/utils/validate-name';
import { useAccount } from '@/src/core/providers/account';
import { ProfileFieldsProps } from '../type';

export function ProfileForm({ user }: ProfileFieldsProps) {
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [savedName, setSavedName] = useState(user.name);
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const nameError = isEditing ? validateName(name) : undefined;
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountType = toAccountType(account?.type);

  useEffect(() => {
    if (isEditing) nameInputRef.current?.focus();
  }, [isEditing]);

  function cancelEditing() {
    setName(savedName);
    setIssues([]);
    setIsEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIssues([]);
    setIsSubmitting(true);

    try {
      const session = getSession();

      if (!session) throw new Error('Sessão não encontrada. Entre novamente.');

      await updateUser(session.accessToken, { name });
      setSavedName(name);
      setIsEditing(false);
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
        <h2 className="text-sm font-black m-0">Meus dados</h2>
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
          ref={nameInputRef}
          label="Nome"
          inputClassName={themeClasses.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={nameError ?? issues.find((issue) => issue.field === 'name')?.message}
          autoComplete="name"
          disabled={!isEditing}
          action={
            <button
              type="button"
              onClick={isEditing ? cancelEditing : () => setIsEditing(true)}
              aria-label={isEditing ? 'Cancelar edição do nome' : 'Editar nome'}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition cursor-pointer"
            >
              {isEditing ? <X size={14} /> : <Pencil size={14} />}
            </button>
          }
        />
        <TextField
          label="E-mail"
          inputClassName={themeClasses.input}
          value={user.email}
          disabled
          readOnly
        />
      </div>

      <button
        type="submit"
        disabled={!isEditing || isSubmitting || Boolean(nameError) || name === savedName}
        className="w-full py-2.5 bg-indigo-600 enabled:hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
