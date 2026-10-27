import { PostForm } from '../../../post-form';

export default async function NewPostPage({
  params,
  searchParams,
}: PageProps<'/perfil/[username]/posts/novo'>) {
  const [{ username }, { posicao }] = await Promise.all([params, searchParams]);

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PostForm username={decodeURIComponent(username)} mode="create" initialPosition={Number(posicao) || undefined} />
    </main>
  );
}
