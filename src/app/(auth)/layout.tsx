import { ReactNode } from 'react';
import { ShieldIcon } from '@/src/core/icons';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-center space-x-2">
          <ShieldIcon />
          <div>
            <p className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent">
              ScoutMe PRO
            </p>
            <p className="text-[10px] text-slate-400">Scouting de base</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
