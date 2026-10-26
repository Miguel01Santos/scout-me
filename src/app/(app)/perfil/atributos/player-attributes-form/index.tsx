'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerAttributes } from '@/src/core/api/player-attributes/type';
import { PageHeader } from '@/src/core/components/page-header';
import { AccountType } from '@/src/core/enums/account-type';
import {
  PlayerAttributesText,
  PLAYER_ATTRIBUTES_TEXT,
  PlayerCategory,
  PlayerPosition,
  PreferredFoot,
} from '@/src/core/enums/player-attributes';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { AttributeSelect } from '../attribute-select';
import { PlayerAttributesSkeleton } from '../player-attributes-skeleton';
import { PlayerAttributesFormProps } from './type';

// Depois dos atributos, o cadastro segue para a edição do perfil, como nos outros tipos.
const PROFILE_EDIT_AFTER_ONBOARDING = '/perfil/editar?origem=tipo-de-conta';

function PlayerAttributesFields({
  saved,
  text,
  isOnboarding,
}: {
  saved: PlayerAttributes;
  text: PlayerAttributesText;
  isOnboarding: boolean;
}) {
  const router = useRouter();
  const { updatePlayerAttributes } = useAccount();
  const themeClasses = useThemeClasses();
  const [position, setPosition] = useState(saved.position);
  const [preferredFoot, setPreferredFoot] = useState(saved.preferredFoot);
  const [category, setCategory] = useState(saved.category);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges =
    position !== saved.position ||
    preferredFoot !== saved.preferredFoot ||
    category !== saved.category;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // No cadastro, "Concluir" sem nada preenchido só segue em frente.
    if (!hasChanges) {
      if (isOnboarding) router.replace(PROFILE_EDIT_AFTER_ONBOARDING);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await updatePlayerAttributes({ preferredFoot, position, category });
      // Fora do cadastro volta para o perfil, onde os atributos aparecem.
      // O botão segue em "Salvando..." até a próxima tela abrir.
      router.replace(isOnboarding ? PROFILE_EDIT_AFTER_ONBOARDING : '/perfil');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <div className="space-y-3">
        <AttributeSelect
          label={text.position.label}
          placeholder={text.placeholder}
          value={position}
          isDisabled={isSubmitting}
          onChange={setPosition}
          options={Object.values(PlayerPosition).map((value) => ({
            value,
            label: `${text.position.values[value].full} (${text.position.values[value].short})`,
          }))}
        />
        <AttributeSelect
          label={text.preferredFoot.label}
          placeholder={text.placeholder}
          value={preferredFoot}
          isDisabled={isSubmitting}
          onChange={setPreferredFoot}
          options={Object.values(PreferredFoot).map((value) => ({
            value,
            label: text.preferredFoot.values[value].full,
          }))}
        />
        <AttributeSelect
          label={text.category.label}
          placeholder={text.placeholder}
          value={category}
          isDisabled={isSubmitting}
          onChange={setCategory}
          options={Object.values(PlayerCategory).map((value) => ({
            value,
            label: text.category.values[value].full,
          }))}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || (!isOnboarding && !hasChanges)}
        className="w-full py-2.5 bg-indigo-600 enabled:hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? text.saving : isOnboarding ? text.finish : text.save}
      </button>

      {isOnboarding && (
        <button
          type="button"
          onClick={() => router.replace(PROFILE_EDIT_AFTER_ONBOARDING)}
          disabled={isSubmitting}
          className={`w-full py-2.5 border rounded-xl font-bold text-xs transition enabled:hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.subText}`}
        >
          {text.skip}
        </button>
      )}
    </form>
  );
}

export function PlayerAttributesForm({ isOnboarding }: PlayerAttributesFormProps) {
  const router = useRouter();
  const { account, configuration, isLoading } = useAccount();
  const themeClasses = useThemeClasses();
  const text = PLAYER_ATTRIBUTES_TEXT[configuration.language];
  const isPlayer = account?.type === AccountType.PLAYER;

  // Só Player tem atributos; a API também recusa os outros tipos.
  useEffect(() => {
    if (!isLoading && !isPlayer) router.replace('/perfil');
  }, [isLoading, isPlayer, router]);

  return (
    <>
      {/* No cadastro, voltar vai para a home: a tela anterior no histórico é o login ou o cadastro. */}
      <PageHeader
        title={isOnboarding ? text.onboardingTitle : text.edit}
        backHref={isOnboarding ? '/home' : undefined}
      />
      {isOnboarding && <p className={`text-xs ${themeClasses.subText}`}>{text.onboardingHint}</p>}
      {isPlayer && account.playerAttributes ? (
        <PlayerAttributesFields
          saved={account.playerAttributes}
          text={text}
          isOnboarding={isOnboarding}
        />
      ) : (
        <PlayerAttributesSkeleton />
      )}
    </>
  );
}
