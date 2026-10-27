import { PostForm } from '../../../../post-form';

export default async function EditPostPage({
  params,
}: PageProps<'/perfil/[username]/posts/[id]/editar'>) {
  const { username, id } = await params;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PostForm username={decodeURIComponent(username)} mode="edit" postId={Number(id)} />
    </main>
  );
}
