'use client';

import { useEffect, useState } from 'react';
import { Button, toast } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import {
  clearNotifications,
  getNotifications,
  markNotificationAsRead,
} from '@/src/core/api/notifications/service';
import { AppNotification } from '@/src/core/api/notifications/type';
import { getSession } from '@/src/core/auth';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { useAccount } from '@/src/core/providers/account';
import { dayKey, formatDayLabel } from '@/src/core/utils/format-day-label';
import { NotificationItem } from '../notification-item';
import { NotificationsSkeleton } from '../notifications-skeleton';
import { NotificationDay } from './type';

function groupByDay(notifications: AppNotification[]) {
  return notifications.reduce<NotificationDay[]>((days, notification) => {
    const key = dayKey(notification.createdAt);
    const lastDay = days.at(-1);

    if (lastDay?.key === key) {
      lastDay.notifications.push(notification);
    } else {
      days.push({ key, label: formatDayLabel(notification.createdAt), notifications: [notification] });
    }

    return days;
  }, []);
}

function countUnread(notifications: AppNotification[]) {
  return notifications.filter((notification) => !notification.readAt).length;
}

export function NotificationsList() {
  const themeClasses = useThemeClasses();
  const { setUnreadNotificationsCount } = useAccount();
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getNotifications(session.accessToken)
      .then(({ notifications: loadedNotifications }) => {
        setNotifications(loadedNotifications);
        setUnreadNotificationsCount(countUnread(loadedNotifications));
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiError ? error.message : 'Não foi possível carregar as notificações.'
        );
        setNotifications([]);
      });
  }, [setUnreadNotificationsCount]);

  function openNotification(notification: AppNotification) {
    const session = getSession();

    if (!session || !notifications || notification.readAt) return;

    const readAt = new Date().toISOString();
    const updatedNotifications = notifications.map((item) =>
      item.id === notification.id ? { ...item, readAt } : item
    );

    setNotifications(updatedNotifications);
    setUnreadNotificationsCount(countUnread(updatedNotifications));
    markNotificationAsRead(session.accessToken, notification.id).catch(() => undefined);
  }

  async function clearAll() {
    const session = getSession();

    if (!session) return;

    setIsClearing(true);

    try {
      await clearNotifications(session.accessToken);
      setNotifications([]);
      setUnreadNotificationsCount(0);
      setIsClearDialogOpen(false);
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível limpar as notificações.');
    } finally {
      setIsClearing(false);
    }
  }

  if (!notifications) return <NotificationsSkeleton />;

  return (
    <section className="space-y-5">
      {notifications.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsClearDialogOpen(true)}
            className={`flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80 ${themeClasses.subText}`}
          >
            <Trash2 size={14} />
            Limpar todas
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {!errorMessage && notifications.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>Nenhuma notificação por enquanto.</p>
      )}

      {groupByDay(notifications).map((day) => (
        <div key={day.key} className="space-y-3">
          <h2 className={`text-[10px] font-bold uppercase ${themeClasses.subText}`}>{day.label}</h2>
          {day.notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={() => openNotification(notification)}
            />
          ))}
        </div>
      ))}

      <DialogComponent
        isOpen={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        className={themeClasses.bg}
        title="Limpar notificações?"
        body={<p>Todas as suas notificações serão apagadas. Isso não pode ser desfeito.</p>}
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button variant="danger" onPress={clearAll} isDisabled={isClearing}>
              Limpar todas
            </Button>
          </>
        }
      />
    </section>
  );
}
