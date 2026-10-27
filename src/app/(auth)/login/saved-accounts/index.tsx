'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { forgetSavedAccount, listSavedSessions, switchToSavedAccount } from '@/src/core/auth';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';

export function SavedAccounts() {
  const router = useRouter();
  const [savedSessions, setSavedSessions] = useState(() => listSavedSessions());

  function enter(userId: string) {
    if (switchToSavedAccount(null, userId)) router.replace('/home');
  }

  function forget(userId: string) {
    forgetSavedAccount(userId);
    setSavedSessions(listSavedSessions());
  }

  if (savedSessions.length === 0) return null;

  return (
    <section className="p-4 border rounded-2xl space-y-3 bg-slate-900/90 border-slate-800">
      <div>
        <h2 className="text-sm font-black m-0 text-slate-100">Contas neste aparelho</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Toque para entrar sem digitar a senha.</p>
      </div>

      {savedSessions.map(({ session, profile }) => (
        <div key={session.user.id} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => enter(session.user.id)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <ProfileAvatar name={profile.name} avatarUrl={profile.avatarUrl} color={profile.avatarColor} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-100">{profile.name}</span>
              {profile.username && (
                <span className="block truncate text-xs text-slate-400">@{profile.username}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => forget(session.user.id)}
            aria-label={`Remover ${profile.name} deste aparelho`}
            className="p-2 text-slate-400 hover:text-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </section>
  );
}
