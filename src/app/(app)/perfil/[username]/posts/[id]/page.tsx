import { PostDetail } from '../../../post-detail';

export default async function PostPage({ params }: PageProps<'/perfil/[username]/posts/[id]'>) {
  const { username, id } = await params;

  return (
    <main className="max-w-md mx-auto px-4 pt-4 pb-12 space-y-4">
      <PostDetail username={decodeURIComponent(username)} postId={Number(id)} />
    </main>
  );
}
