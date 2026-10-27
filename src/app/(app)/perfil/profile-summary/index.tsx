'use client';

import { useSession } from '@/src/core/auth/use-session';
import { AccountType } from '@/src/core/enums/account-type';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { resolveAvatarUrl } from '@/src/core/utils/resolve-avatar-url';
import { ClubMembersSection } from '../club-members';
import { PlayerAttributesSection } from '../player-attributes';
import { PrivateRatingsSection } from '../private-ratings';
import { ProfilePosts } from '../profile-posts';
import { ProfileSummarySkeleton } from '../profile-summary-skeleton';
import { ProfileView } from '../profile-view';
import { RatingCriteriaSection } from '../rating-criteria';

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
        ratingScore: account.ratingScore,
        ratingsCount: account.ratingsCount,
        club: account.club,
        athletesCount: account.athletesCount,
        followsHref: `/perfil/${account.username}`,
      }}
    >
      {account.type === AccountType.PLAYER && (
        <>
          {account.playerAttributes && (
            <PlayerAttributesSection
              attributes={account.playerAttributes}
              language={configuration.language}
              isEditable
            />
          )}
          <RatingCriteriaSection criteria={account.ratingCriteria} ratingScore={account.ratingScore} />
        </>
      )}
      {account.type === AccountType.TEAM && <ClubMembersSection username={account.username} />}
      <ProfilePosts username={account.username} isOwner />
      {account.type === AccountType.PLAYER && <PrivateRatingsSection />}
    </ProfileView>
  );
}
