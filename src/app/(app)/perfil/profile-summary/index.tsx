'use client';

import { useSession } from '@/src/core/auth/use-session';
import { UserAvatar } from '@/src/core/components/user-avatar';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { PROFILE_STATS } from '../constants';
import { ProfileSummarySkeleton } from '../profile-summary-skeleton';

export function ProfileSummary() {
  const { user } = useSession();
  const { account, isLoading } = useAccount();
  const themeClasses = useThemeClasses();

  if (!user || isLoading) return <ProfileSummarySkeleton />;

  const profile = account?.profile;
  const displayName = getDisplayName(user.name, profile);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />

        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-black m-0 truncate">{displayName}</h2>
          <p className={`text-xs ${themeClasses.subText}`}>
            <span className="font-bold">{PROFILE_STATS.followers}</span> seguidores{' '}
            <span className="font-bold">{PROFILE_STATS.following}</span> seguindo
          </p>
        </div>
      </div>

      {profile?.bio && <p className="text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>}
    </div>
  );
}
