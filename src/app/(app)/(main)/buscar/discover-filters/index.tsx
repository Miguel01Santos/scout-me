'use client';

import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DISCOVER_FILTERS } from '../constants';
import { DiscoverFiltersProps } from './type';

export function DiscoverFilters({ value, onChange }: DiscoverFiltersProps) {
  const themeClasses = useThemeClasses();

  return (
    <div
      role="group"
      aria-label="Filtrar busca"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {DISCOVER_FILTERS.map(({ value: filter, label, icon: Icon }) => {
        const isActive = filter === value;

        return (
          <button
            key={filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter)}
            className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none ${
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : `${themeClasses.card} ${themeClasses.subText} hover:opacity-80`
            }`}
          >
            <Icon size={16} strokeWidth={2} className="shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
