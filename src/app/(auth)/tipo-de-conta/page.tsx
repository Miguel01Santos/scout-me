'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/src/core/api';
import { chooseAccountType, getAccount } from '@/src/core/api/account/service';
import { ensureSession, getSession } from '@/src/core/auth';
import { AccountType } from '@/src/core/enums/account-type';
import { Language } from '@/src/core/enums/language';
import { AccountTypeCard } from './account-type-card';
import { AccountTypeSkeleton } from './account-type-skeleton';
import { ConfirmAccountTypeDialog } from './confirm-account-type-dialog';
import { ACCOUNT_TYPE_OPTIONS, PLAN_LABEL } from './constants';

export default function TipoDeContaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(Language.PT);
  // O tipo tocado fica guardado mesmo com o diálogo fechando, para o título não sumir na animação.
  const [pendingType, setPendingType] = useState<AccountType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // A tela é só para quem ainda não escolheu: sem login vai para o login, com tipo vai para o app.
  useEffect(() => {
    ensureSession()
      .then(async (session) => {
        if (!session) {
          router.replace('/login');
          return;
        }

        const { account } = await getAccount(session.accessToken);

        if (account.type) {
          router.replace('/home');
          return;
        }

        if (account.configuration) setLanguage(account.configuration.language);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!getSession()) {
          router.replace('/login');
          return;
        }

        setErrorMessage(
          error instanceof ApiError ? error.message : 'Não foi possível carregar sua conta.'
        );
        setIsLoading(false);
      });
  }, [router]);

  function handleSelect(type: AccountType) {
    setPendingType(type);
    setIsConfirmOpen(true);
  }

  async function handleConfirm() {
    const session = getSession();

    if (!session || !pendingType || isSaving) return;

    setErrorMessage('');
    setIsSaving(true);

    try {
      await chooseAccountType(session.accessToken, pendingType);
      // push em vez de replace: o "voltar" da edição cai aqui, e esta tela manda para a home.
      router.push('/perfil/editar');
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.'
      );
      setIsSaving(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-black m-0 text-slate-100">
          O que você quer fazer no ScoutMe PRO?
        </h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Isso define o tipo da sua conta. Você escolhe uma vez só.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <AccountTypeSkeleton />
      ) : (
        <div className="space-y-3">
          {ACCOUNT_TYPE_OPTIONS.map((option) => (
            <AccountTypeCard
              key={option.type}
              option={option}
              planLabel={PLAN_LABEL[language]}
              isSaving={isSaving && pendingType === option.type}
              isDisabled={isSaving}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <ConfirmAccountTypeDialog
        isOpen={isConfirmOpen}
        type={pendingType}
        isSaving={isSaving}
        onConfirm={handleConfirm}
        onOpenChange={setIsConfirmOpen}
      />
    </div>
  );
}
