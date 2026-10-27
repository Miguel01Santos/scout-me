import { AppNotification } from '@/src/core/api/notifications/type';

export interface NotificationItemProps {
  notification: AppNotification;
  onOpen: () => void;
}
