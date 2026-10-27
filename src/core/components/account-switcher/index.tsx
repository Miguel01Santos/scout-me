'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, UserPlus } from 'lucide-react';
import {
  addAnotherAccount,
  listSavedSessions,
  SAVED_SESSIONS_LIMIT,
  switchToSavedAccount,
} from '../../auth';
import { useAccount } from '../../providers/account';
import { ProfileAvatar } from '../profile-avatar';
import { AccountSwitcherProps } from './type';

const OPTION_CLASS_NAME =
  'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-default';

export function AccountSwitcher({ currentProfile, onLeave }: AccountSwitcherProps) {
  const router = useRouter();
  const { refreshAccount } = useAccount();
  const [savedSessions] = useState(() => listSavedSessions());

  async function switchTo(userId: string) {
    if (!switchToSavedAccount(currentProfile, userId)) return;

    onLeave();
    await refreshAccount().catch(() => undefined);
    router.replace('/home');
  }

  function addAccount() {
    if (!currentProfile) return;

    addAnotherAccount(currentProfile);
    onLeave();
    router.replace('/login');
  }

  return (
    <div className="mt-2 border-t border-default pt-2">
      <p className="px-3 pb-1 text-[10px] font-bold uppercase text-slate-400">Contas</p>

      {savedSessions.map(({ session, profile }) => (
        <button
          key={session.user.id}
          type="button"
          onClick={() => switchTo(session.user.id)}
          className={OPTION_CLASS_NAME}
        >
          <span className="flex min-w-0 items-center gap-3">
            <ProfileAvatar name={profile.name} avatarUrl={profile.avatarUrl} color={profile.avatarColor} size="sm" />
            <span className="min-w-0 text-left">
              <span className="block truncate">{profile.name}</span>
              {profile.username && (
                <span className="block truncate text-xs text-muted">@{profile.username}</span>
              )}
            </span>
          </span>
          <ArrowLeftRight size={16} className="shrink-0" />
        </button>
      ))}

      {currentProfile && savedSessions.length < SAVED_SESSIONS_LIMIT && (
        <button type="button" onClick={addAccount} className={OPTION_CLASS_NAME}>
          <span className="flex items-center gap-3">
            <UserPlus size={18} />
            Adicionar conta
          </span>
        </button>
      )}
    </div>
  );
}
