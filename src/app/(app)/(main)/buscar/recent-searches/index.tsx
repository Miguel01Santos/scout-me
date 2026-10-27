'use client';

import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { ProfileResult } from '@/src/core/components/profile-result';
import { RecentSearchesProps } from './type';

export function RecentSearches({ searches, onSelect, onRemove }: RecentSearchesProps) {
  const themeClasses = useThemeClasses();

  return (
    <div className="space-y-3">
      <h2 className={`text-[10px] font-bold uppercase ${themeClasses.subText}`}>Recentes</h2>
      {searches.map((search) => (
        <ProfileResult
          key={search.username}
          profile={search}
          onSelect={() => onSelect(search.username)}
          onRemove={() => onRemove(search.username)}
        />
      ))}
    </div>
  );
}
