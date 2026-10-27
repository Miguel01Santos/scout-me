import { NotificationTitle } from '@/src/core/enums/notification-title';

export const NOTIFICATION_HEADINGS: Record<string, string> = {
  [NotificationTitle.REQUEST_FOLLOW]: 'Pedido para seguir',
  [NotificationTitle.ACCEPTED_REQUEST_FOLLOW]: 'Pedido aceito',
  [NotificationTitle.FOLLOWED_YOU_BACK]: 'Novo seguidor',
  [NotificationTitle.WELCOME]: 'Bem-vindo ao ScoutMe PRO',
  [NotificationTitle.RATED_YOU]: 'Nova avaliação',
  [NotificationTitle.RATED_YOU_PRIVATELY]: 'Avaliação privada',
  [NotificationTitle.RATED_YOU_PENDING]: 'Avaliação para revisar',
  [NotificationTitle.REQUEST_RATING]: 'Pedido de avaliação',
  [NotificationTitle.REQUEST_PRIVATE_RATING]: 'Pedido de avaliação privada',
  [NotificationTitle.MENTIONED_YOU]: 'Menção',
  [NotificationTitle.CLUB_INVITE]: 'Convite de clube',
  [NotificationTitle.CLUB_INVITE_ACCEPTED]: 'Novo membro no clube',
};

export const APP_ICON_SRC = '/icons/icon-192.png';
