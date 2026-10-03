'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { LinkCardProps } from './type';

export function LinkCard({ label, href, icon: Icon }: LinkCardProps) {
  const themeClasses = useThemeClasses();

  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-3.5 border rounded-2xl transition ${themeClasses.card} ${themeClasses.cardHover}`}
    >
      <span className="flex items-center gap-3 text-sm font-bold">
        <Icon size={18} />
        {label}
      </span>
      <ChevronRight size={16} className={themeClasses.subText} />
    </Link>
  );
}
