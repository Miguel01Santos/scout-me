'use client';

import { useSession } from '@/src/core/auth/use-session';
import { useAccount } from '@/src/core/providers/account';
import { LanguageSelect } from '../language-select';
import { LanguageSkeleton } from '../language-skeleton';
import { ProfileForm } from '../profile-form';
import { ProfileSkeleton } from '../profile-skeleton';

export function AccountSettings() {
  const { user } = useSession();
  const { isLoading } = useAccount();

  // Os dois cards dependem de dados diferentes (usuário e conta); esperar ambos evita
  // um card aparecer pronto enquanto o outro ainda é skeleton.
  if (!user || isLoading) {
    return (
      <>
        <ProfileSkeleton />
        <LanguageSkeleton />
      </>
    );
  }

  return (
    <>
      <ProfileForm user={user} />
      <LanguageSelect />
    </>
  );
}
