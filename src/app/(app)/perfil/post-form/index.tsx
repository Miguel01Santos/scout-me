'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';
import { MapPin } from 'lucide-react';
import { ApiError } from '@/src/core/api';
import { createPost, getProfilePosts, updatePost, uploadPostPhotos } from '@/src/core/api/posts/service';
import { Post } from '@/src/core/api/posts/type';
import { getSession } from '@/src/core/auth';
import { PageHeader } from '@/src/core/components/page-header';
import { PostCarousel } from '@/src/core/components/post-carousel';
import { TextAreaField } from '@/src/core/components/textarea-field';
import { POST_DESCRIPTION_MAX_LENGTH, POST_POSITIONS, POSTS_LIMIT } from '@/src/core/enums/post';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { MentionsPicker } from '../mentions-picker';
import { PostPhotoPicker } from '../post-photo-picker';
import { PickedPhoto } from '../post-photo-picker/type';
import { PostFormLoadState, PostFormProps } from './type';

export function PostForm({ username, mode, postId, initialPosition }: PostFormProps) {
  const router = useRouter();
  const { account } = useAccount();
  const themeClasses = useThemeClasses();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadState, setLoadState] = useState<PostFormLoadState>('loading');
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [description, setDescription] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [position, setPosition] = useState<number | null>(null);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isOwner = account?.username === username;
  const editingPost = posts.find((post) => post.id === postId);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getProfilePosts(session.accessToken, username)
      .then(({ posts: loadedPosts }) => {
        const freePositions = POST_POSITIONS.filter(
          (item) => !loadedPosts.some((post) => post.position === item)
        );
        const post = loadedPosts.find((item) => item.id === postId);

        setPosts(loadedPosts);
        setPosition(
          initialPosition && freePositions.includes(initialPosition)
            ? initialPosition
            : (freePositions[0] ?? null)
        );

        if (post) {
          setDescription(post.description ?? '');
          setMentions(post.mentions.map((mention) => mention.username));
        }

        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));
  }, [username, postId, initialPosition]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session = getSession();

    if (!session) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'edit' && postId) {
        await updatePost(session.accessToken, postId, {
          description: description.trim() || null,
          mentions,
        });
        toast.success('Post atualizado');
        router.replace(`/perfil/${username}/posts/${postId}`);
        return;
      }

      if (!position) return;

      setUploadedCount(0);
      const urls = await uploadPostPhotos(
        session.accessToken,
        photos.map((photo) => photo.blob),
        setUploadedCount
      );

      await createPost(session.accessToken, {
        position,
        description: description.trim() || null,
        photos: urls,
        mentions,
      });
      toast.success('Post publicado');
      router.replace('/perfil');
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.');
      setUploadedCount(null);
      setIsSubmitting(false);
    }
  }

  const title = mode === 'edit' ? 'Editar post' : 'Novo post';
  const messageClassName = `p-4 border rounded-2xl text-sm text-center ${themeClasses.card} ${themeClasses.subText}`;

  if (loadState === 'loading' || !account) {
    return (
      <>
        <PageHeader title={title} />
        <p className={messageClassName}>Carregando…</p>
      </>
    );
  }

  if (!isOwner || loadState === 'error' || (mode === 'edit' && !editingPost)) {
    return (
      <>
        <PageHeader title={title} />
        <p className={messageClassName}>
          {!isOwner
            ? 'Você só pode publicar no seu próprio perfil.'
            : 'Não foi possível carregar o post. Tente novamente.'}
        </p>
      </>
    );
  }

  if (mode === 'create' && !position) {
    return (
      <>
        <PageHeader title={title} />
        <p className={messageClassName}>
          Você já tem {POSTS_LIMIT} posts. Apague um para publicar outro.
        </p>
      </>
    );
  }

  const descriptionError =
    description.length > POST_DESCRIPTION_MAX_LENGTH
      ? `A descrição pode ter no máximo ${POST_DESCRIPTION_MAX_LENGTH} caracteres`
      : undefined;
  const canSubmit =
    !isSubmitting && !descriptionError && (mode === 'edit' || photos.length > 0);

  return (
    <>
      <PageHeader title={title} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
            {errorMessage}
          </p>
        )}

        {mode === 'create' ? (
          <PostPhotoPicker photos={photos} isDisabled={isSubmitting} onChange={setPhotos} />
        ) : (
          editingPost && (
            <div className="space-y-2">
              <PostCarousel photos={editingPost.photos} alt={editingPost.description ?? 'Post'} />
              <p className={`text-[11px] ${themeClasses.subText}`}>
                Para trocar as fotos, apague o post e crie outro.
              </p>
            </div>
          )
        )}

        <TextAreaField
          label="Descrição"
          inputClassName={themeClasses.input}
          value={description}
          onChange={setDescription}
          error={descriptionError}
          counter={`${description.length}/${POST_DESCRIPTION_MAX_LENGTH}`}
          rows={3}
          isDisabled={isSubmitting}
        />

        <MentionsPicker value={mentions} isDisabled={isSubmitting} onChange={setMentions} />

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400">Localização</span>
          <div
            className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs opacity-60 ${themeClasses.input}`}
          >
            <MapPin size={14} />
            Em breve você vai poder marcar o local do jogo ou treino.
          </div>
        </div>

        {mode === 'create' && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Posição no perfil</span>
            <div className="grid grid-cols-5 gap-1.5">
              {POST_POSITIONS.map((item) => {
                const isTaken = posts.some((post) => post.position === item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPosition(item)}
                    disabled={isTaken || isSubmitting}
                    aria-pressed={item === position}
                    className={`h-9 rounded-lg border text-xs font-bold transition disabled:opacity-30 ${
                      item === position
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : `${themeClasses.input} ${themeClasses.subText}`
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 rounded-xl bg-indigo-600 enabled:hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadedCount !== null && uploadedCount < photos.length
            ? `Enviando fotos (${uploadedCount}/${photos.length})…`
            : isSubmitting
              ? 'Salvando…'
              : mode === 'edit'
                ? 'Salvar'
                : 'Publicar'}
        </button>
      </form>
    </>
  );
}
