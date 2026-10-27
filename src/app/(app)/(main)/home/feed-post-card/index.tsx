'use client';

import Link from 'next/link';
import { AccountTypeTag } from '@/src/core/components/account-type-tag';
import { PostCarousel } from '@/src/core/components/post-carousel';
import { PostMentions } from '@/src/core/components/post-mentions';
import { ProfileAvatar } from '@/src/core/components/profile-avatar';
import { AccountType } from '@/src/core/enums/account-type';
import { toAvatarColor } from '@/src/core/enums/avatar-color';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { formatDayLabel } from '@/src/core/utils/format-day-label';
import { getDisplayName } from '@/src/core/utils/get-display-name';
import { FeedPostCardProps } from './type';

export function FeedPostCard({ item }: FeedPostCardProps) {
  const themeClasses = useThemeClasses();
  const { author, post } = item;
  const name = getDisplayName(author.name, author);

  return (
    <article className={`space-y-3 rounded-2xl border p-3 ${themeClasses.card}`}>
      <div className="flex items-center gap-3">
        <Link href={`/perfil/${author.username}`} className="flex min-w-0 flex-1 items-center gap-3">
          <ProfileAvatar
            name={name}
            avatarUrl={author.avatarUrl}
            color={toAvatarColor(author.avatarColor)}
            size="sm"
          />
          <span className="min-w-0">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-bold">{name}</span>
              {author.type && author.type !== AccountType.ORGANIZATION && (
                <AccountTypeTag type={author.type} />
              )}
            </span>
            <span className={`block truncate text-xs ${themeClasses.subText}`}>@{author.username}</span>
          </span>
        </Link>
        <time dateTime={item.createdAt} className={`shrink-0 text-[11px] ${themeClasses.subText}`}>
          {formatDayLabel(item.createdAt)}
        </time>
      </div>

      <Link href={`/perfil/${author.username}/posts/${post.id}`} className="block">
        <PostCarousel photos={post.photos} alt={post.description ?? `Post de @${author.username}`} />
      </Link>

      {post.description && (
        <p className="text-sm">
          <span className="font-bold">@{author.username}</span> {post.description}
        </p>
      )}
      <PostMentions mentions={post.mentions} />
    </article>
  );
}
