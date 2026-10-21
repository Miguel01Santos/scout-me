'use client';

import { LoaderCircle } from 'lucide-react';
import { ACCOUNT_TYPE_NAME, FREE_ACCOUNT_TYPES } from '@/src/core/enums/account-type';
import { AccountTypeCardProps } from './type';

export function AccountTypeCard({
  option,
  planLabel,
  isSaving,
  isDisabled,
  onSelect,
}: AccountTypeCardProps) {
  const { type, icon: Icon, description } = option;
  const isPaid = !FREE_ACCOUNT_TYPES.includes(type);
  const isInteractive = !isPaid && !isDisabled;

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      disabled={isPaid || isDisabled}
      aria-busy={isSaving}
      className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border bg-slate-900/90 p-4 pr-14 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed ${
        isSaving ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800'
      } ${isInteractive ? 'hover:border-indigo-500 active:scale-[0.99]' : ''}`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition ${
          isPaid ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-100'
        } ${isSaving ? 'bg-indigo-600 text-white' : ''} ${
          isInteractive ? 'group-hover:bg-indigo-600 group-hover:text-white' : ''
        }`}
      >
        {isSaving ? <LoaderCircle size={20} className="animate-spin" /> : <Icon size={20} />}
      </span>

      <span className="flex min-w-0 flex-col gap-1">
        <span className={`text-sm font-black ${isPaid ? 'text-slate-400' : 'text-slate-100'}`}>
          {ACCOUNT_TYPE_NAME[type]}
        </span>
        <span
          className={`text-[11px] leading-relaxed ${isPaid ? 'text-slate-500' : 'text-slate-400'}`}
        >
          {description}
        </span>
        {isPaid && (
          <span className="text-[10px] font-bold text-amber-400">
            Disponível em breve nos planos pagos
          </span>
        )}
      </span>

      {/* Fita diagonal no canto: o overflow-hidden do card corta as pontas. */}
      <span
        className={`pointer-events-none absolute -right-9 top-3.5 w-32 rotate-45 py-1 text-center text-[10px] font-black uppercase tracking-wider shadow-md ${
          isPaid ? 'bg-amber-400 text-amber-950' : 'bg-emerald-500 text-white'
        }`}
      >
        {isPaid ? planLabel.paid : planLabel.free}
      </span>
    </button>
  );
}
