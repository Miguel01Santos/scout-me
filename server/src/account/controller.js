import { updateAccountSchema, updateConfigurationSchema } from './schema.js';
import { getAccount, updateAccount, updateConfiguration } from './service.js';

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
