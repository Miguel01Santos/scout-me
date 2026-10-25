'use client';

import { useSession } from '@/src/core/auth/use-session';
import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { StarRating } from '@/src/core/components/star-rating';
import { UserAvatar } from '@/src/core/components/user-avatar';
import { AccountType } from '@/src/core/enums/account-type';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { pluralize } from '@/src/core/utils/pluralize';
import { resolveAvatarUrl } from '@/src/core/utils/resolve-avatar-url';
import { PROFILE_STATS } from '../constants';
import { PhotoViewer } from '../photo-viewer';
import { PlayerAttributesSection } from '../player-attributes';
import { ProfileSummarySkeleton } from '../profile-summary-skeleton';

export function ProfileSummary() {
  const { user } = useSession();
  const { account, configuration, isLoading } = useAccount();
  const themeClasses = useThemeClasses();

  if (!user || isLoading) return <ProfileSummarySkeleton />;

  const profile = account?.profile;
  const displayName = getDisplayName(user.name, profile);
  const avatarUrl = resolveAvatarUrl(profile, user.avatarUrl);
  const avatar = <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <PhotoViewer src={avatarUrl} alt={displayName}>
            {avatar}
          </PhotoViewer>
        ) : (
          avatar
        )}

        <div className="min-w-0 flex flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-black m-0 truncate">{displayName}</h2>
            {/* Organization ainda não tem perfil próprio (é plano pago). */}
            {account?.type && account.type !== AccountType.ORGANIZATION && (
              <AccountTypeTag type={account.type} />
            )}
          </div>
          <p className={`text-xs ${themeClasses.subText}`}>
            <span className="font-bold">{PROFILE_STATS.followers}</span>{' '}
            {pluralize(PROFILE_STATS.followers, 'seguidor', 'seguidores')}{' '}
            <span className="font-bold">{PROFILE_STATS.following}</span> seguindo{' '}
            <span className="font-bold">{PROFILE_STATS.ratingsCount}</span>{' '}
            {pluralize(PROFILE_STATS.ratingsCount, 'avaliação', 'avaliações')}
          </p>
          <StarRating value={PROFILE_STATS.rating} />
        </div>
      </div>

      {profile?.bio && <p className="text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>}

      {account?.type === AccountType.PLAYER && account.playerAttributes && (
        <PlayerAttributesSection
          attributes={account.playerAttributes}
          language={configuration.language}
        />
      )}
    </div>
  );
}
