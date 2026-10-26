'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/src/core/api';
import { followProfile, getPublicProfile, unfollowProfile } from '@/src/core/api/profiles/service';
import { PublicProfile } from '@/src/core/api/profiles/type';
import { getSession } from '@/src/core/auth';
import { PageHeader } from '@/src/core/components/page-header';
import { AccountType } from '@/src/core/enums/account-type';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { FollowStatus } from '@/src/core/enums/follow-status';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { DialogUnfollow } from '../../dialog-unfollow';
import { FollowButton } from '../../follow-button';
import { PlayerAttributesSection } from '../../player-attributes';
import { PrivateProfileNotice } from '../../private-profile-notice';
import { ProfileSummarySkeleton } from '../../profile-summary-skeleton';
import { ProfileView } from '../../profile-view';
import { ShareProfileButton } from '../../share-profile-button';
import { VisitorProfileLoadState, VisitorProfileProps } from './type';

export function VisitorProfile({ username }: VisitorProfileProps) {
  const router = useRouter();
  const { configuration } = useAccount();
  const themeClasses = useThemeClasses();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loadState, setLoadState] = useState<VisitorProfileLoadState>('loading');
  const [isFollowBusy, setIsFollowBusy] = useState(false);
  const [isUnfollowDialogOpen, setIsUnfollowDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getPublicProfile(session.accessToken, username)
      .then(({ profile: loadedProfile }) => {
        if (loadedProfile.isOwner) {
          router.replace('/perfil');
          return;
        }

        setProfile(loadedProfile);
        setLoadState('ready');
      })
      .catch((error) => {
        setLoadState(error instanceof ApiError && error.status === 404 ? 'not-found' : 'error');
      });
  }, [username, router]);

  async function changeFollow(updateFollow: typeof followProfile) {
    const session = getSession();

    if (!session || !profile) return;

    setErrorMessage('');
    setIsFollowBusy(true);

    try {
      const { profile: updatedProfile } = await updateFollow(session.accessToken, profile.username);

      setProfile(updatedProfile);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsFollowBusy(false);
    }
  }

  function handleFollowPress() {
    if (profile?.followStatus === FollowStatus.ACCEPTED) {
      setIsUnfollowDialogOpen(true);
      return;
    }

    changeFollow(profile?.followStatus === FollowStatus.PENDING ? unfollowProfile : followProfile);
  }

  function confirmUnfollow() {
    setIsUnfollowDialogOpen(false);
    changeFollow(unfollowProfile);
  }

  const displayName = profile ? getDisplayName(profile.name, profile) : '';

  return (
    <>
      <PageHeader title="Perfil" />

      {loadState === 'loading' && <ProfileSummarySkeleton />}

      {(loadState === 'not-found' || loadState === 'error') && (
        <p className={`p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`}>
          {loadState === 'not-found'
            ? 'Perfil não encontrado.'
            : 'Não foi possível carregar o perfil. Tente novamente.'}
        </p>
      )}

      {loadState === 'ready' && profile && (
        <ProfileView
          profile={{
            name: displayName,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            avatarColor: toAvatarColor(profile.avatarColor),
            type: profile.type,
            followersCount: profile.followersCount,
            followingCount: profile.followingCount,
            bio: profile.bio,
          }}
          action={
            <div className="space-y-2">
              {errorMessage && (
                <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
                  {errorMessage}
                </p>
              )}
              <div className="flex gap-2">
                <FollowButton
                  status={profile.followStatus ?? FollowStatus.NONE}
                  isBusy={isFollowBusy}
                  onPress={handleFollowPress}
                />
                <ShareProfileButton name={displayName} username={profile.username} />
              </div>
            </div>
          }
        >
          {profile.canViewDetails ? (
            profile.type === AccountType.PLAYER &&
            profile.playerAttributes && (
              <PlayerAttributesSection
                attributes={profile.playerAttributes}
                language={configuration.language}
              />
            )
          ) : (
            <PrivateProfileNotice isRequestPending={profile.followStatus === FollowStatus.PENDING} />
          )}
        </ProfileView>
      )}

      {profile && (
        <DialogUnfollow
          isOpen={isUnfollowDialogOpen}
          onOpenChange={setIsUnfollowDialogOpen}
          name={displayName}
          isPrivate={profile.isPrivate}
          onConfirm={confirmUnfollow}
        />
      )}
    </>
  );
}
