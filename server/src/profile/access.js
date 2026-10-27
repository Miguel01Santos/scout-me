import { FollowStatus } from '../follow/constants.js';
import { findFollowStatus } from '../follow/service.js';

export async function canViewContent(viewer, account) {
  if (viewer.id === account.id || !account.isPrivate) return true;

  return (await findFollowStatus(viewer.id, account.id)) === FollowStatus.ACCEPTED;
}
