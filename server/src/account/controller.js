import {
  chooseAccountTypeSchema,
  updateAccountSchema,
  updateConfigurationSchema,
  updatePlayerAttributesSchema,
  updateProfileSchema,
} from './schema.js';
import {
  acceptFollowRequestFrom,
  chooseAccountType,
  declineFollowRequestFrom,
  getAccount,
  getFollowRequests,
  updateAccount,
  updateConfiguration,
  updatePlayerAttributes,
  updateProfile,
} from './service.js';

export async function me(request, response) {
  const account = await getAccount(request.userId);

  return response.status(200).json({ account });
}

export async function update(request, response) {
  const data = updateConfigurationSchema.parse(request.body);
  const account = await updateConfiguration(request.userId, data);

  return response.status(200).json({ account });
}

export async function updateMe(request, response) {
  const data = updateAccountSchema.parse(request.body);
  const account = await updateAccount(request.userId, data);

  return response.status(200).json({ account });
}

export async function updateMyType(request, response) {
  const data = chooseAccountTypeSchema.parse(request.body);
  const account = await chooseAccountType(request.userId, data);

  return response.status(200).json({ account });
}

export async function updateMyPlayerAttributes(request, response) {
  const data = updatePlayerAttributesSchema.parse(request.body);
  const account = await updatePlayerAttributes(request.userId, data);

  return response.status(200).json({ account });
}

export async function followRequests(request, response) {
  const requests = await getFollowRequests(request.userId);

  return response.status(200).json({ requests });
}

export async function acceptRequest(request, response) {
  const account = await acceptFollowRequestFrom(request.userId, request.params.username);

  return response.status(200).json({ account });
}

export async function declineRequest(request, response) {
  const account = await declineFollowRequestFrom(request.userId, request.params.username);

  return response.status(200).json({ account });
}

export async function updateMyProfile(request, response) {
  const data = updateProfileSchema.parse(request.body);
  const account = await updateProfile(request.userId, data);

  return response.status(200).json({ account });
}
