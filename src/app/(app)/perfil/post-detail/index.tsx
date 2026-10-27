'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, toast } from '@heroui/react';
import { Pencil, Trash2 } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { deletePost, getProfilePosts, updatePost } from '@/src/core/api/posts/service';
import { Post } from '@/src/core/api/posts/type';
import { getSession } from '@/src/core/auth';
import { PageHeader } from '@/src/core/components/page-header';
import { PostCarousel } from '@/src/core/components/post-carousel';
import { PostMentions } from '@/src/core/components/post-mentions';
import { POST_POSITIONS } from '@/src/core/enums/post';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { useAccount } from '@/src/core/providers/account';
import { formatDayLabel } from '@/src/core/utils/format-day-label';
import { PostDetailLoadState, PostDetailProps } from './type';

export function PostDetail({ username, postId }: PostDetailProps) {
  const router = useRouter();
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const [post, setPost] = useState<Post | null>(null);
  const [loadState, setLoadState] = useState<PostDetailLoadState>('loading');
  const [isBusy, setIsBusy] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isOwner = account?.username === username;

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getProfilePosts(session.accessToken, username)
      .then(({ posts }) => {
        const loadedPost = posts.find((item) => item.id === postId);

        setPost(loadedPost ?? null);
        setLoadState(loadedPost ? 'ready' : 'not-found');
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 403) setLoadState('private');
        else if (error instanceof ApiError && error.status === 404) setLoadState('not-found');
        else setLoadState('error');
      });
  }, [username, postId]);

  async function moveTo(position: number) {
    const session = getSession();

    if (!session || !post || position === post.position) return;

    setIsBusy(true);

    try {
      const { post: updatedPost } = await updatePost(session.accessToken, post.id, { position });

      setPost(updatedPost);
      toast.success(`Post movido para a posição ${position}`);
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível mover o post.');
    } finally {
      setIsBusy(false);
    }
  }

  async function removePost() {
    const session = getSession();

    if (!session || !post) return;

    setIsBusy(true);

    try {
      await deletePost(session.accessToken, post.id);
      toast.success('Post apagado');
      router.replace('/perfil');
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Não foi possível apagar o post.');
      setIsBusy(false);
    }
  }

  if (loadState !== 'ready' || !post) {
    const messages: Record<Exclude<PostDetailLoadState, 'ready'>, string> = {
      loading: 'Carregando…',
      'not-found': 'Post não encontrado.',
      private: 'Esta conta é privada. Siga para ver os posts.',
      error: 'Não foi possível carregar o post. Tente novamente.',
    };

    return (
      <>
        <PageHeader title="Post" />
        <p className={`p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`}>
          {messages[loadState === 'ready' ? 'not-found' : loadState]}
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Post" />

      <article className="space-y-3">
        <PostCarousel photos={post.photos} alt={post.description ?? `Post de @${username}`} />

        <div className="space-y-1">
          <p className="text-sm">
            <Link href={`/perfil/${username}`} className="font-bold">
              @{username}
            </Link>{' '}
            {post.description}
          </p>
          <PostMentions mentions={post.mentions} />
          <p className={`text-[11px] ${themeClasses.subText}`}>{formatDayLabel(post.createdAt)}</p>
        </div>
      </article>

      {isOwner && (
        <section className={`space-y-3 rounded-2xl border p-3 ${themeClasses.card}`}>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Posição no perfil</span>
            <div className="grid grid-cols-5 gap-1.5">
              {POST_POSITIONS.map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => moveTo(position)}
                  disabled={isBusy}
                  aria-pressed={position === post.position}
                  className={`h-9 rounded-lg border text-xs font-bold transition disabled:opacity-50 ${
                    position === post.position
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : `${themeClasses.input} ${themeClasses.subText}`
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
            <p className={`text-[11px] ${themeClasses.subText}`}>
              Se a posição já tiver um post, os dois trocam de lugar.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/perfil/${username}/posts/${post.id}/editar`}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition hover:opacity-80 ${themeClasses.subText}`}
            >
              <Pencil size={14} />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isBusy}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/40 py-2 text-xs font-bold text-rose-400 transition hover:opacity-80 disabled:opacity-50"
            >
              <Trash2 size={14} />
              Apagar
            </button>
          </div>
        </section>
      )}

      <DialogComponent
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        className={themeClasses.bg}
        title="Apagar post?"
        body={<p>O post e as fotos dele serão apagados. Isso não pode ser desfeito.</p>}
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button variant="danger" onPress={removePost} isDisabled={isBusy}>
              Apagar
            </Button>
          </>
        }
      />
    </>
  );
}
