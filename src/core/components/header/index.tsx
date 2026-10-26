'use client';

import { Skeleton } from '@heroui/react';
import { House, Search, Send } from 'lucide-react';
import { useSession } from '../../auth/use-session';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { AvatarComponent } from '../../library/avatar';
import { useAccount } from '../../providers/account';
import { HeaderNav } from '../header-nav';
import { HeaderNavItem } from '../header-nav/type';

const NAV_ITEMS: HeaderNavItem[] = [
  { href: '/home', label: 'Home', icon: House },
  { href: '/enviar', label: 'Mensagens', icon: Send },
  { href: '/buscar', label: 'Descobrir', icon: Search },
];

export function Header() {
  const { user } = useSession();
  const { account, isLoading } = useAccount();
  const themeClasses = useThemeClasses();

  return (
    <div className="flex items-center gap-5">
      {/* Espera a conta também: a cor do anel depende do tipo, e sem ele piscaria a cor errada. */}
      {user && !isLoading ? (
        <AvatarComponent
          name={user.name}
          avatarUrl={user.avatarUrl}
          accountType={account?.type}
        />
      ) : (
        <Skeleton className={`size-[35px] rounded-full ${themeClasses.skeleton}`} />
      )}

      <div aria-hidden className={`h-5 w-px ${themeClasses.divider}`} />

      <HeaderNav items={NAV_ITEMS} />
    </div>
  );
}
