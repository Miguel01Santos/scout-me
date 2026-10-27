export interface NotificationGenerator {
  username: string;
  name: string;
  avatarUrl: string | null;
  avatarColor: string | null;
}

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  createdAt: string;
  readAt: string | null;
  generator: NotificationGenerator | null;
}
