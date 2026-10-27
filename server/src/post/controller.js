import {
  createPostSchema,
  postParamsSchema,
  postSignaturesSchema,
  updatePostSchema,
} from './schema.js';
import {
  createPost,
  createPostUploads,
  deletePost,
  listFriends,
  listProfilePosts,
  updatePost,
} from './service.js';

export async function profilePosts(request, response) {
  const posts = await listProfilePosts(request.userId, request.params.username);

  return response.status(200).json({ posts });
}

export async function friends(request, response) {
  const accounts = await listFriends(request.userId);

  return response.status(200).json({ friends: accounts });
}

export async function uploadSignatures(request, response) {
  const { count } = postSignaturesSchema.parse(request.body);
  const signatures = await createPostUploads(request.userId, count);

  return response.status(200).json({ signatures });
}

export async function create(request, response) {
  const data = createPostSchema.parse(request.body);
  const post = await createPost(request.userId, data);

  return response.status(201).json({ post });
}

export async function update(request, response) {
  const { id } = postParamsSchema.parse(request.params);
  const data = updatePostSchema.parse(request.body);
  const post = await updatePost(request.userId, id, data);

  return response.status(200).json({ post });
}

export async function remove(request, response) {
  const { id } = postParamsSchema.parse(request.params);

  await deletePost(request.userId, id);

  return response.status(204).send();
}
