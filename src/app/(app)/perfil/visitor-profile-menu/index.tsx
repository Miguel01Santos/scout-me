'use client';

import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, Label, toast } from '@heroui/react';
import { Lock, Menu, MessageCircle, Shield, Star } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { inviteToClub, removeFromClub } from '@/src/core/api/clubs/service';
import { requestRating } from '@/src/core/api/ratings/service';
import { RatingActions } from '@/src/core/api/ratings/type';
import { getSession } from '@/src/core/auth';
import { ClubAction } from '@/src/core/enums/club';
import { RatingActionStatus } from '@/src/core/enums/rating';
import { useDarkMode } from '@/src/core/hooks/use-dark-mode';
import { VisitorMenuOption, VisitorMenuOptionText, VisitorProfileMenuProps } from './type';

const ITEM_CLASS_NAME = 'flex items-center gap-3 text-sm';

const OPTION_TEXT: Record<VisitorMenuOption, VisitorMenuOptionText> = {
  rate: {
    label: 'Avaliar',
    icon: Star,
    statusLabel: { [RatingActionStatus.DONE]: 'Avaliado' },
  },
  'rate-private': {
    label: 'Avaliação privada',
    icon: Lock,
    statusLabel: { [RatingActionStatus.DONE]: 'Avaliação privada enviada' },
  },
  request: {
    label: 'Pedir avaliação',
    icon: Star,
    statusLabel: {
      [RatingActionStatus.PENDING]: 'Avaliação pedida',
      [RatingActionStatus.DONE]: 'Avaliação recebida',
    },
  },
  'request-private': {
    label: 'Pedir avaliação privada',
    icon: Lock,
    statusLabel: {
      [RatingActionStatus.PENDING]: 'Avaliação privada pedida',
      [RatingActionStatus.DONE]: 'Avaliação privada recebida',
    },
  },
  club: { label: 'Convidar para o clube', icon: Shield },
  message: { label: 'Mensagem', icon: MessageCircle },
};

const CLUB_OPTION_LABEL: Record<ClubAction, string> = {
  [ClubAction.INVITE]: 'Convidar para o clube',
  [ClubAction.INVITED]: 'Convite de clube enviado',
  [ClubAction.MEMBER]: 'Remover do clube',
};

const RATING_OPTIONS: [Exclude<VisitorMenuOption, 'message'>, keyof RatingActions][] = [
  ['rate', 'rate'],
  ['rate-private', 'ratePrivately'],
  ['request', 'requestRating'],
  ['request-private', 'requestPrivateRating'],
];

export function VisitorProfileMenu({ ratingActions, clubAction, username, onChange }: VisitorProfileMenuProps) {
  const router = useRouter();
  const darkMode = useDarkMode();
  const ratingOptions = ratingActions
    ? RATING_OPTIONS.map(([option, action]) => ({ option, status: ratingActions[action] })).filter(
        ({ status }) => status !== RatingActionStatus.UNAVAILABLE
      )
    : [];
  const disabledOptions: VisitorMenuOption[] = ratingOptions
    .filter(({ status }) => status !== RatingActionStatus.AVAILABLE)
    .map(({ option }) => option);

  if (clubAction === ClubAction.INVITED) disabledOptions.push('club');

  async function changeClub() {
    const session = getSession();

    if (!session) return;

    try {
      if (clubAction === ClubAction.MEMBER) {
        await removeFromClub(session.accessToken, username);
        toast.success('Removido do clube');
      } else {
        await inviteToClub(session.accessToken, username);
        toast.success('Convite para o clube enviado');
      }

      onChange();
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível atualizar o clube.');
    }
  }

  async function askForRating(isPrivate: boolean) {
    const session = getSession();

    if (!session) return;

    try {
      await requestRating(session.accessToken, username, isPrivate);
      toast.success(isPrivate ? 'Pedido de avaliação privada enviado' : 'Pedido de avaliação enviado');
      onChange();
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível enviar o pedido.');
    }
  }

  function handleAction(key: Key) {
    if (key === 'rate') router.push(`/perfil/${username}/avaliar`);
    if (key === 'rate-private') router.push(`/perfil/${username}/avaliar?privada=1`);
    if (key === 'request') askForRating(false);
    if (key === 'request-private') askForRating(true);
    if (key === 'club') changeClub();
  }

  const options: { option: VisitorMenuOption; status: RatingActionStatus }[] = [...ratingOptions];

  if (clubAction) options.push({ option: 'club', status: RatingActionStatus.AVAILABLE });
  if (options.length === 0) return null;

  options.push({ option: 'message', status: RatingActionStatus.AVAILABLE });

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Opções do perfil"
        className="flex p-2 border rounded-xl bg-transparent text-inherit hover:opacity-80 transition cursor-pointer"
      >
        <Menu size={20} />
      </Dropdown.Trigger>

      <Dropdown.Popover
        placement="bottom end"
        className={`min-w-48 border shadow-lg ${
          darkMode
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <Dropdown.Menu
          aria-label="Opções do perfil"
          disabledKeys={disabledOptions}
          onAction={handleAction}
        >
          {options.map(({ option, status }) => {
            const { label, icon: Icon, statusLabel } = OPTION_TEXT[option];
            const text =
              option === 'club' && clubAction ? CLUB_OPTION_LABEL[clubAction] : (statusLabel?.[status] ?? label);

            return (
              <Dropdown.Item
                key={option}
                id={option}
                textValue={text}
                className={`${ITEM_CLASS_NAME} data-[disabled=true]:opacity-50`}
              >
                <Icon size={16} />
                <Label className="text-inherit">{text}</Label>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
