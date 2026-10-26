'use client';

import { FollowStatus } from '@/src/core/enums/follow-status';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { FollowButtonProps } from './type';

const FOLLOW_LABEL: Record<FollowStatus, string> = {
  [FollowStatus.NONE]: 'Seguir',
  [FollowStatus.PENDING]: 'Solicitado',
  [FollowStatus.ACCEPTED]: 'Seguindo',
};

export function FollowButton({ status, isBusy, onPress }: FollowButtonProps) {
  const themeClasses = useThemeClasses();
  const isFollowing = status !== FollowStatus.NONE;

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={isBusy}
      aria-pressed={isFollowing}
      className={`flex-1 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? `border ${themeClasses.subText} enabled:hover:opacity-80`
          : 'bg-indigo-600 text-white enabled:hover:bg-indigo-500'
      }`}
    >
      {FOLLOW_LABEL[status]}
    </button>
  );
}
