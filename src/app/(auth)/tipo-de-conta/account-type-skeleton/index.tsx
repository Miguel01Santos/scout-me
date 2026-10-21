import { Skeleton } from '@heroui/react';
import { ACCOUNT_TYPE_OPTIONS } from '../constants';

export function AccountTypeSkeleton() {
  return (
    <div className="space-y-3">
      {ACCOUNT_TYPE_OPTIONS.map(({ type }) => (
        <Skeleton key={type} className="h-[84px] rounded-2xl bg-slate-800" />
      ))}
    </div>
  );
}
