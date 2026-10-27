'use client';

import Link from 'next/link';
import { useThemeClasses } from '../../hooks/use-theme-classes';
import { PostMentionsProps } from './type';

export function PostMentions({ mentions }: PostMentionsProps) {
  const themeClasses = useThemeClasses();

  if (mentions.length === 0) return null;

  return (
    <p className={`text-xs ${themeClasses.subText}`}>
      com{' '}
      {mentions.map((mention, index) => (
        <span key={mention.username}>
          {index > 0 && ', '}
          <Link href={`/perfil/${mention.username}`} className="font-bold text-indigo-500">
            @{mention.username}
          </Link>
        </span>
      ))}
    </p>
  );
}
