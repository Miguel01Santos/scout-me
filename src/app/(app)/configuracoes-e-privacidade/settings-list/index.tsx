'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { SETTINGS_ROUTES } from '../constants';

export function SettingsList() {
  const themeClasses = useThemeClasses();

  return (
    <nav className="space-y-2">
      {SETTINGS_ROUTES.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center justify-between p-3.5 border rounded-2xl transition ${themeClasses.card} ${themeClasses.cardHover}`}
        >
          <span className="flex items-center gap-3 text-sm font-bold">
            <Icon size={18} />
            {label}
          </span>
          <ChevronRight size={16} className={themeClasses.subText} />
        </Link>
      ))}
    </nav>
  );
}
