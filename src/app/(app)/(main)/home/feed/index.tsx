'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/src/core/api';
import { getFeed } from '@/src/core/api/feed/service';
import { FeedItem } from '@/src/core/api/feed/type';
import { getSession } from '@/src/core/auth';
import { RatingCard } from '@/src/core/components/rating-card';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { FeedPostCard } from '../feed-post-card';
import { FeedSkeleton } from '../feed-skeleton';

export function Feed() {
  const themeClasses = useThemeClasses();
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getFeed(session.accessToken)
      .then((page) => {
        setItems(page.items);
        setNextCursor(page.nextCursor);
      })
      .catch((error) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível carregar o feed.');
        setItems([]);
      });
  }, []);

  async function loadMore() {
    const session = getSession();

    if (!session || !nextCursor) return;

    setIsLoadingMore(true);

    try {
      const page = await getFeed(session.accessToken, nextCursor);

      setItems((current) => [...(current ?? []), ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível carregar mais.');
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (!items) return <FeedSkeleton />;

  return (
    <section className="space-y-4">
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      {!errorMessage && items.length === 0 && (
        <div className={`space-y-2 rounded-2xl border p-4 text-center ${themeClasses.card}`}>
          <p className="text-sm font-bold">Seu feed está vazio</p>
          <p className={`text-xs ${themeClasses.subText}`}>
            Siga atletas, scouts e times para ver os posts e as avaliações deles aqui.
          </p>
          <Link href="/buscar" className="inline-block text-xs font-bold text-indigo-500">
            Ir para o Descobrir
          </Link>
        </div>
      )}

      {items.map((item) =>
        item.type === 'post' ? (
          <FeedPostCard key={item.id} item={item} />
        ) : (
          <RatingCard key={item.id} rating={item.rating} />
        )
      )}

      {nextCursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoadingMore}
          className={`w-full rounded-xl border py-2.5 text-xs font-bold transition hover:opacity-80 disabled:opacity-50 ${themeClasses.subText}`}
        >
          {isLoadingMore ? 'Carregando…' : 'Carregar mais'}
        </button>
      )}
    </section>
  );
}
