'use client';

import { Share2 } from 'lucide-react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { shareProfile } from '@/src/core/utils/share-profile';
import { ShareProfileButtonProps } from './type';

export function ShareProfileButton({ name, username }: ShareProfileButtonProps) {
  const themeClasses = useThemeClasses();

  return (
    <button
      type="button"
      onClick={() => shareProfile({ name, username })}
      className={`flex flex-1 items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition hover:opacity-80 ${themeClasses.subText}`}
    >
      <Share2 size={14} />
      Compartilhar
    </button>
  );
}
