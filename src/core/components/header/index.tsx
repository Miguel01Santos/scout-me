'use client';

import { Skeleton } from '@heroui/react';
import { useSession } from '../../auth/use-session';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { AvatarComponent } from '../../library/avatar';

export function Header() {
  const { user } = useSession();
  const themeClasses = useThemeClasses();

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <AvatarComponent name={user.name} accountType={user.account?.type} />
      ) : (
        <Skeleton className={`size-[35px] rounded-full ${themeClasses.skeleton}`} />
      )}
    </div>
  );
}
