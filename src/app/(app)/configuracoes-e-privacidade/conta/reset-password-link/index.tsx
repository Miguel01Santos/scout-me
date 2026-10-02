'use client';

import Link from 'next/link';
import { ChevronRight, KeyRound } from 'lucide-react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';

export function ResetPasswordLink() {
  const themeClasses = useThemeClasses();

  return (
    <Link
      href="/redefinir-senha"
      className={`flex items-center justify-between p-3.5 border rounded-2xl transition ${themeClasses.card} ${themeClasses.cardHover}`}
    >
      <span className="flex items-center gap-3 text-sm font-bold">
        <KeyRound size={18} />
        Redefinir minha senha
      </span>
      <ChevronRight size={16} className={themeClasses.subText} />
    </Link>
  );
}
