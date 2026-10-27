'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Route } from 'next';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { NotificationTitle } from '@/src/core/enums/notification-title';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { formatTime } from '@/src/core/utils/format-time';
import { APP_ICON_SRC, NOTIFICATION_HEADINGS } from '../constants';
import { NotificationItemProps } from './type';

export function NotificationItem({ notification, onOpen }: NotificationItemProps) {
  const themeClasses = useThemeClasses();
  const { generator } = notification;
  const heading = NOTIFICATION_HEADINGS[notification.title];
  const isUnread = !notification.readAt;
  const isWelcome = notification.title === NotificationTitle.WELCOME;
  const cardClassName = isWelcome
    ? 'border-indigo-500/40 bg-gradient-to-r from-amber-400/10 to-indigo-500/10'
    : themeClasses.card;
  const headingClassName = isWelcome
    ? 'font-black bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent'
    : isUnread
      ? 'font-bold'
      : 'font-normal';
  const className = `flex items-start gap-3 p-3 border rounded-2xl transition ${cardClassName} ${
    isUnread ? '' : 'opacity-60'
  }`;

  const content = (
    <>
      {generator ? (
        <ProfileAvatar
          name={generator.name}
          avatarUrl={generator.avatarUrl}
          color={toAvatarColor(generator.avatarColor)}
          size="md"
        />
      ) : (
        <Image src={APP_ICON_SRC} alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl" />
      )}
      <span className="min-w-0 flex-1">
        {heading && <span className={`block w-fit text-sm ${headingClassName}`}>{heading}</span>}
        <span className={`block text-xs leading-relaxed ${themeClasses.subText}`}>
          {generator && <span className="font-semibold">{generator.name} </span>}
          {notification.message}
        </span>
        <time
          dateTime={notification.createdAt}
          className={`mt-1 block text-[11px] ${themeClasses.subText}`}
        >
          {formatTime(notification.createdAt)}
        </time>
      </span>
      {isUnread && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-indigo-500">
          <span className="sr-only">Não lida</span>
        </span>
      )}
    </>
  );

  if (!notification.link) {
    return (
      <button type="button" onClick={onOpen} className={`${className} w-full text-left`}>
        {content}
      </button>
    );
  }

  return (
    <Link
      href={notification.link as Route}
      onClick={onOpen}
      className={`${className} ${themeClasses.cardHover}`}
    >
      {content}
    </Link>
  );
}
