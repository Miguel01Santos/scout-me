import { del, get, postAuthenticated } from '../index';
import { AppNotification } from './type';

export function getNotifications(accessToken: string) {
  return get<{ notifications: AppNotification[] }>('/notifications', accessToken);
}

export function markNotificationAsRead(accessToken: string, notificationId: number) {
  return postAuthenticated<null>(`/notifications/${notificationId}/read`, accessToken);
}

export function clearNotifications(accessToken: string) {
  return del<null>('/notifications', accessToken);
}
