import { AppNotification } from '@/src/core/api/notifications/type';

export interface NotificationDay {
  key: string;
  label: string;
  notifications: AppNotification[];
}
