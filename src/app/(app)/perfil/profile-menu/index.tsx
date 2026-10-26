'use client';

import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, Label } from '@heroui/react';
import { Lock, Menu, Share2, UserPen } from 'lucide-react';
import { useSession } from '@/src/core/auth/use-session';
import { useDarkMode } from '@/src/core/hooks/use-dark-mode';
import { useAccount } from '@/src/core/providers/account';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { shareProfile } from '@/src/core/utils/share-profile';

const ITEM_CLASS_NAME = 'flex items-center gap-3 text-sm';

export function ProfileMenu() {
  const router = useRouter();
  const darkMode = useDarkMode();
  const { user } = useSession();
  const { account } = useAccount();

  function handleAction(key: Key) {
    if (key === 'edit') router.push('/perfil/editar');
    if (key === 'privacy') router.push('/configuracoes-e-privacidade/privacidade');
    if (key === 'share' && user && account) {
      shareProfile({ name: getDisplayName(user.name, account.profile), username: account.username });
    }
  }

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Opções do perfil"
        className="flex p-2 border rounded-xl bg-transparent text-inherit hover:opacity-80 transition cursor-pointer"
      >
        <Menu size={20} />
      </Dropdown.Trigger>

      {/* O menu abre num portal, fora do AppShell, então as cores vão explícitas aqui. */}
      <Dropdown.Popover
        placement="bottom end"
        className={`min-w-48 border shadow-lg ${
          darkMode
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <Dropdown.Menu aria-label="Opções do perfil" onAction={handleAction}>
          <Dropdown.Item id="edit" textValue="Editar perfil" className={ITEM_CLASS_NAME}>
            <UserPen size={16} />
            <Label className="text-inherit">Editar perfil</Label>
          </Dropdown.Item>
          <Dropdown.Item id="share" textValue="Compartilhar" className={ITEM_CLASS_NAME}>
            <Share2 size={16} />
            <Label className="text-inherit">Compartilhar</Label>
          </Dropdown.Item>
          <Dropdown.Item id="privacy" textValue="Privacidade" className={ITEM_CLASS_NAME}>
            <Lock size={16} />
            <Label className="text-inherit">Privacidade</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
