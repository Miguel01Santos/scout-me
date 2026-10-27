import {
  acceptClubInvite,
  declineClubInvite,
  getMyClub,
  inviteToClub,
  leaveClub,
  listClubMembers,
  removeFromClub,
} from './service.js';

export async function members(request, response) {
  const result = await listClubMembers(request.userId, request.params.username);

  return response.status(200).json(result);
}

export async function invite(request, response) {
  await inviteToClub(request.userId, request.params.username);

  return response.status(201).send();
}

export async function remove(request, response) {
  await removeFromClub(request.userId, request.params.username);

  return response.status(204).send();
}

export async function myClub(request, response) {
  const result = await getMyClub(request.userId);

  return response.status(200).json(result);
}

export async function acceptInvite(request, response) {
  const result = await acceptClubInvite(request.userId, request.params.username);

  return response.status(200).json(result);
}

export async function declineInvite(request, response) {
  const result = await declineClubInvite(request.userId, request.params.username);

  return response.status(200).json(result);
}

export async function leave(request, response) {
  const result = await leaveClub(request.userId);

  return response.status(200).json(result);
}
