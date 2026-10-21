import { Skeleton } from '@heroui/react';
import { ACCOUNT_TYPE_OPTIONS } from '../constants';

// Mesmo desenho dos cards: ícone, nome, duas linhas de descrição e a fita no canto.
export function AccountTypeSkeleton() {
  return (
    <div className="space-y-3">
      {ACCOUNT_TYPE_OPTIONS.map(({ type }) => (
        <div
          key={type}
          className="relative flex items-start gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-4 pr-14"
        >
          <Skeleton className="size-10 shrink-0 rounded-xl bg-slate-800" />

          <div className="flex w-full flex-col gap-2 pt-0.5">
            <Skeleton className="h-3.5 w-20 bg-slate-800" />
            <Skeleton className="h-2.5 w-full bg-slate-800" />
            <Skeleton className="h-2.5 w-3/4 bg-slate-800" />
          </div>

          <Skeleton className="absolute -right-9 top-3.5 h-5 w-32 rotate-45 rounded-none bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
