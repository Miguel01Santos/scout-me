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
