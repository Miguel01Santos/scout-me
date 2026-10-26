'use client';

import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { StarRating } from '@/src/core/components/star-rating';
import { AccountType } from '@/src/core/enums/account-type';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { pluralize } from '@/src/core/utils/pluralize';
import { PROFILE_STATS } from '../constants';
import { PhotoViewer } from '../photo-viewer';
import { ProfileViewProps } from './type';

export function ProfileView({ profile, action, children }: ProfileViewProps) {
  const themeClasses = useThemeClasses();
  const avatar = (
    <ProfileAvatar name={profile.name} avatarUrl={profile.avatarUrl} color={profile.avatarColor} />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          <PhotoViewer src={profile.avatarUrl} alt={profile.name}>
            {avatar}
          </PhotoViewer>
        ) : (
          avatar
        )}

        <div className="min-w-0 flex flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-black m-0 truncate">{profile.name}</h2>
            {profile.type && profile.type !== AccountType.ORGANIZATION && (
              <AccountTypeTag type={profile.type} />
            )}
          </div>
          <span className={`text-xs truncate ${themeClasses.subText}`}>@{profile.username}</span>
          <p className={`text-xs ${themeClasses.subText}`}>
            <span className="font-bold">{profile.followersCount}</span>{' '}
            {pluralize(profile.followersCount, 'seguidor', 'seguidores')}{' '}
            <span className="font-bold">{profile.followingCount}</span> seguindo{' '}
            <span className="font-bold">{PROFILE_STATS.ratingsCount}</span>{' '}
            {pluralize(PROFILE_STATS.ratingsCount, 'avaliação', 'avaliações')}
          </p>
          <StarRating value={PROFILE_STATS.rating} />
        </div>
      </div>

      {action}

      {profile.bio && <p className="text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>}

      {children}
    </div>
  );
}
