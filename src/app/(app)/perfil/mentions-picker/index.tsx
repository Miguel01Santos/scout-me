'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { getFriends } from '@/src/core/api/posts/service';
import { ProfileCard } from '@/src/core/api/profiles/type';
import { getSession } from '@/src/core/auth';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { POST_MENTIONS_LIMIT } from '@/src/core/enums/post';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { MentionsPickerProps } from './type';

export function MentionsPicker({ value, isDisabled, onChange }: MentionsPickerProps) {
  const themeClasses = useThemeClasses();
  const [friends, setFriends] = useState<ProfileCard[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getFriends(session.accessToken)
      .then(({ friends: loadedFriends }) => setFriends(loadedFriends))
      .catch(() => setFriends([]));
  }, []);

  function toggle(username: string) {
    onChange(value.includes(username) ? value.filter((item) => item !== username) : [...value, username]);
  }

  const term = query.trim().replace(/^@/, '').toLowerCase();
  const visibleFriends = (friends ?? []).filter(
    (friend) =>
      !term ||
      friend.username.includes(term) ||
      getDisplayName(friend.name, friend).toLowerCase().includes(term)
  );
  const isFull = value.length >= POST_MENTIONS_LIMIT;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400">Mencionar amigos</span>
        <span className={`text-[10px] ${themeClasses.subText}`}>
          {value.length}/{POST_MENTIONS_LIMIT}
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((username) => (
            <button
              key={username}
              type="button"
              onClick={() => toggle(username)}
              disabled={isDisabled}
              aria-label={`Tirar a menção de @${username}`}
              className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white"
            >
              @{username}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      {friends?.length === 0 ? (
        <p className={`text-xs italic ${themeClasses.subText}`}>
          Você ainda não tem amigos para mencionar. Amigos são pessoas que você segue e que seguem você.
        </p>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar amigo"
            disabled={isDisabled}
            className={`w-full rounded-xl border p-2.5 text-xs outline-none ${themeClasses.input}`}
          />
          <div className={`max-h-56 overflow-y-auto rounded-xl border ${themeClasses.card}`}>
            {!friends && <p className={`p-3 text-xs ${themeClasses.subText}`}>Carregando amigos…</p>}
            {visibleFriends.map((friend) => {
              const name = getDisplayName(friend.name, friend);
              const isSelected = value.includes(friend.username);

              return (
                <button
                  key={friend.username}
                  type="button"
                  onClick={() => toggle(friend.username)}
                  disabled={isDisabled || (!isSelected && isFull)}
                  aria-pressed={isSelected}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:opacity-80 disabled:opacity-40"
                >
                  <ProfileAvatar
                    name={name}
                    avatarUrl={friend.avatarUrl}
                    color={toAvatarColor(friend.avatarColor)}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold">{name}</span>
                    <span className={`block truncate text-[11px] ${themeClasses.subText}`}>@{friend.username}</span>
                  </span>
                  {isSelected && <Check size={16} className="shrink-0 text-indigo-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
