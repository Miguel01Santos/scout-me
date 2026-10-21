import { ReactNode } from 'react';
import { ShieldIcon } from '@/src/core/icons';

export default function AuthLayout({ children }: { children: ReactNode }) {
  // As telas de entrada são sempre escuras: o tema do usuário só existe depois do login.
  // O data-theme faz os componentes do HeroUI usarem as cores do modo escuro aqui também.
  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-center space-x-2">
          <ShieldIcon />
          <p className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent">
            ScoutMe PRO
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
