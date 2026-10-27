import { findAccountByUserId, findAccountByUsername } from '../account/service.js';
import { HttpError } from '../http-error.js';
import { canViewContent } from '../profile/access.js';
import { listFollowers, listFollowing } from './service.js';

async function findVisibleProfile(userId, username) {
  const [viewer, account] = await Promise.all([
    findAccountByUserId(userId),
    findAccountByUsername(username),
  ]);

  if (!(await canViewContent(viewer, account))) throw new HttpError(403, 'Esta conta é privada');

  return account;
}

export async function followers(request, response) {
  const account = await findAccountByUserId(request.userId);
  const profiles = await listFollowers(account.id);

  return response.status(200).json({ profiles });
}

export async function following(request, response) {
  const account = await findAccountByUserId(request.userId);
  const profiles = await listFollowing(account.id);

  return response.status(200).json({ profiles });
}

export async function profileFollowers(request, response) {
  const account = await findVisibleProfile(request.userId, request.params.username);
  const profiles = await listFollowers(account.id);

  return response.status(200).json({ profiles });
}

export async function profileFollowing(request, response) {
  const account = await findVisibleProfile(request.userId, request.params.username);
  const profiles = await listFollowing(account.id);

  return response.status(200).json({ profiles });
}
