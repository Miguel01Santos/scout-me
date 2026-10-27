'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Route } from 'next';
import { Shield } from 'lucide-react';
import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { StarRating } from '@/src/core/components/star-rating';
import { AccountType } from '@/src/core/enums/account-type';
import { formatRatingScore, toStars } from '@/src/core/enums/rating';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { pluralize } from '@/src/core/utils/pluralize';
import { PhotoViewer } from '../photo-viewer';
import { ProfileViewProps } from './type';

const RATED_TYPES = [AccountType.PLAYER, AccountType.SCOUT];

function Stat({ count, label, href }: { count: number; label: string; href?: string }) {
  const content = (
    <>
      <span className="font-bold">{count}</span> {label}
    </>
  );

  if (!href) return <span>{content}</span>;

  return (
    <Link href={href as Route} className="hover:underline underline-offset-2">
      {content}
    </Link>
  );
}

export function ProfileView({ profile, action, children }: ProfileViewProps) {
  const themeClasses = useThemeClasses();
  const avatar = (
    <ProfileAvatar name={profile.name} avatarUrl={profile.avatarUrl} color={profile.avatarColor} />
  );
  const stats: ReactNode[] = [
    <Stat
      key="followers"
      count={profile.followersCount}
      label={pluralize(profile.followersCount, 'seguidor', 'seguidores')}
      href={profile.followsHref && `${profile.followsHref}/seguidores`}
    />,
    <Stat
      key="following"
      count={profile.followingCount}
      label="seguindo"
      href={profile.followsHref && `${profile.followsHref}/seguindo`}
    />,
  ];

  if (profile.type === AccountType.PLAYER) {
    stats.push(
      <Stat
        key="ratings"
        count={profile.ratingsCount}
        label={pluralize(profile.ratingsCount, 'avaliação', 'avaliações')}
      />
    );
  }

  if (profile.type === AccountType.TEAM && profile.athletesCount !== null) {
    stats.push(
      <Stat key="athletes" count={profile.athletesCount} label={pluralize(profile.athletesCount, 'atleta', 'atletas')} />
    );
  }

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
          {profile.club && (
            <Link
              href={`/perfil/${profile.club.username}`}
              className={`flex min-w-0 items-center gap-1 text-xs font-semibold ${themeClasses.subText}`}
            >
              <Shield size={12} className="shrink-0" />
              <span className="truncate">{getDisplayName(profile.club.name, profile.club)}</span>
            </Link>
          )}
          <p className={`flex flex-wrap gap-x-1.5 text-xs ${themeClasses.subText}`}>{stats}</p>
          {profile.type && RATED_TYPES.includes(profile.type) && (
            <div className="flex items-center gap-2">
              <StarRating value={toStars(profile.ratingScore)} />
              {profile.type === AccountType.PLAYER && (
                <span className="text-xs font-black text-amber-400">
                  {formatRatingScore(profile.ratingScore)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {action}

      {profile.bio && <p className="text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>}

      {children}
    </div>
  );
}
