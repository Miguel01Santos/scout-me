'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@heroui/react';
import { Layers, Plus } from 'lucide-react';
import { getProfilePosts } from '@/src/core/api/posts/service';
import { Post } from '@/src/core/api/posts/type';
import { getSession } from '@/src/core/auth';
import { POST_POSITIONS } from '@/src/core/enums/post';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { cloudinaryImage } from '@/src/core/utils/cloudinary-image';
import { ProfilePostsProps } from './type';

const THUMBNAIL_WIDTH = 360;

export function ProfilePosts({ username, isOwner }: ProfilePostsProps) {
  const themeClasses = useThemeClasses();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getProfilePosts(session.accessToken, username)
      .then(({ posts: loadedPosts }) => setPosts(loadedPosts))
      .catch(() => setPosts([]));
  }, [username]);

  const slots = isOwner
    ? POST_POSITIONS.map((position) => ({
        position,
        post: posts?.find((post) => post.position === position),
      }))
    : (posts ?? []).map((post) => ({ position: post.position, post }));

  return (
    <section className="space-y-2">
      <h3 className="m-0 text-sm font-black">Posts</h3>

      {!posts && (
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className={`aspect-[4/5] rounded-xl ${themeClasses.skeleton}`} />
          ))}
        </div>
      )}

      {posts && slots.length === 0 && (
        <p className={`text-sm italic ${themeClasses.subText}`}>Nenhum post ainda.</p>
      )}

      {posts && slots.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {slots.map(({ position, post }) =>
            post ? (
              <Link
                key={position}
                href={`/perfil/${username}/posts/${post.id}`}
                className="relative aspect-[4/5] overflow-hidden rounded-xl"
              >
                <Image
                  src={cloudinaryImage(post.photos[0].url, THUMBNAIL_WIDTH)}
                  alt={post.description ?? `Post ${position}`}
                  fill
                  unoptimized
                  sizes="33vw"
                  className="object-cover"
                />
                {post.photos.length > 1 && (
                  <Layers size={16} className="absolute right-1.5 top-1.5 text-white drop-shadow" />
                )}
              </Link>
            ) : (
              <Link
                key={position}
                href={`/perfil/${username}/posts/novo?posicao=${position}`}
                aria-label={`Novo post na posição ${position}`}
                className={`flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed transition hover:opacity-80 ${themeClasses.subText}`}
              >
                <Plus size={20} />
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}
