'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/src/core/api';
import { ApiIssue } from '@/src/core/api/type';
import { loginUser, saveSession } from '@/src/core/auth';
import { TextField } from '@/src/core/components/text-field';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function issueFor(field: string) {
    return issues.find((issue) => issue.field === field)?.message;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIssues([]);
    setIsSubmitting(true);

    try {
      const session = await loginUser({ email, password });

      saveSession(session);
      router.replace('/home');
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.'
      );
      setIssues(error instanceof ApiError ? error.issues : []);
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-2xl space-y-4 bg-slate-900/90 border-slate-800"
    >
      <div>
        <h1 className="text-base font-black m-0 text-slate-100">Entrar</h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Acesse sua conta de olheiro para avaliar atletas.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <div className="space-y-3">
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={issueFor('email')}
          placeholder="edson@scout.com"
          autoComplete="email"
          required
        />

        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={issueFor('password')}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Ainda não tem conta?{' '}
        <Link href="/registro" className="font-bold text-indigo-400 hover:text-indigo-300">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
