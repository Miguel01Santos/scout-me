'use client';

import { useSession } from '@/src/core/auth/use-session';
import { AccountType } from '@/src/core/enums/account-type';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { resolveAvatarUrl } from '@/src/core/utils/resolve-avatar-url';
import { PlayerAttributesSection } from '../player-attributes';
import { ProfileSummarySkeleton } from '../profile-summary-skeleton';
import { ProfileView } from '../profile-view';

export function ProfileSummary() {
  const { user } = useSession();
  const { account, configuration, isLoading } = useAccount();

  if (!user || isLoading || !account) return <ProfileSummarySkeleton />;

  const profile = account.profile;

  return (
    <ProfileView
      profile={{
        name: getDisplayName(user.name, profile),
        username: account.username,
        avatarUrl: resolveAvatarUrl(profile, user.avatarUrl),
        avatarColor: toAvatarColor(profile?.avatarColor),
        type: account.type,
        followersCount: account.followersCount,
        followingCount: account.followingCount,
        bio: profile?.bio ?? null,
      }}
    >
      {account.type === AccountType.PLAYER && account.playerAttributes && (
        <PlayerAttributesSection
          attributes={account.playerAttributes}
          language={configuration.language}
          isEditable
        />
      )}
    </ProfileView>
  );
}
