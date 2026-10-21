import { Skeleton } from '@heroui/react';
import { AuthFormSkeletonProps } from './type';

// Mesmo desenho dos formulários de login e cadastro: título, campos, "Lembre-me", botão e link.
export function AuthFormSkeleton({ fieldCount }: AuthFormSkeletonProps) {
  return (
    <div className="p-4 border rounded-2xl space-y-4 bg-slate-900/90 border-slate-800">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24 bg-slate-800" />
        <Skeleton className="h-2.5 w-40 bg-slate-800" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: fieldCount }, (_, field) => (
          <div key={field} className="space-y-1.5">
            <Skeleton className="h-2.5 w-16 bg-slate-800" />
            <Skeleton className="h-9 w-full rounded-xl bg-slate-800" />
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-md bg-slate-800" />
          <Skeleton className="h-2.5 w-20 bg-slate-800" />
        </div>
      </div>

      <Skeleton className="h-9 w-full rounded-xl bg-slate-800" />

      <div className="flex justify-center">
        <Skeleton className="h-2.5 w-44 bg-slate-800" />
      </div>
    </div>
  );
}
