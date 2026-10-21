'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/src/core/api';
import { ApiIssue } from '@/src/core/api/type';
import { registerUser, saveSession } from '@/src/core/auth';
import { TextField } from '@/src/core/components/text-field';
import { validateName } from '@/src/core/utils/validate-name';
import { RememberMe } from '../remember-me';

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameError = isNameTouched ? validateName(name) : undefined;
  const passwordsMatch = confirmPassword === password;
  const confirmPasswordError =
    isConfirmPasswordTouched && !passwordsMatch ? 'As senhas não coincidem' : undefined;

  function issueFor(field: string) {
    return issues.find((issue) => issue.field === field)?.message;
  }

  function clearIssue(field: string) {
    setIssues((current) => current.filter((issue) => issue.field !== field));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (validateName(name) || !passwordsMatch) {
      setIsNameTouched(true);
      setIsConfirmPasswordTouched(true);
      return;
    }

    setErrorMessage('');
    setIssues([]);
    setIsSubmitting(true);

    try {
      const session = await registerUser({ name, email, password, remember });

      saveSession(session, { remember });
      router.replace('/home');
    } catch (error) {
      const fieldIssues = error instanceof ApiError ? error.issues : [];

      // Erro de campo aparece embaixo do campo; o banner fica para o que não é de nenhum campo.
      setErrorMessage(
        fieldIssues.length > 0
          ? ''
          : error instanceof ApiError
            ? error.message
            : 'Erro inesperado. Tente novamente.'
      );
      setIssues(fieldIssues);
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-2xl space-y-4 bg-slate-900/90 border-slate-800"
    >
      <div>
        <h1 className="text-base font-black m-0 text-slate-100">Criar conta</h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Cadastre-se para começar a registrar avaliações.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <div className="space-y-3">
        <TextField
          label="Nome"
          type="text"
          value={name}
          onChange={(value) => {
            setName(value);
            setIsNameTouched(true);
          }}
          error={nameError ?? issueFor('name')}
          placeholder="Augusto Lima da Silva"
          autoComplete="name"
        />

        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearIssue('email');
          }}
          error={issueFor('email')}
          placeholder="augustolima@gmail.com"
          autoComplete="email"
          isRequired
        />

        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          error={issueFor('password')}
          placeholder="mínimo de 8 caracteres"
          autoComplete="new-password"
          isRequired
        />

        <TextField
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setIsConfirmPasswordTouched(true);
          }}
          error={confirmPasswordError}
          placeholder="repita a senha"
          autoComplete="new-password"
          isRequired
        />

        <RememberMe isSelected={remember} onChange={setRemember} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
      >
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Já tem conta?{' '}
        <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
          Entrar
        </Link>
      </p>
    </form>
  );
}
