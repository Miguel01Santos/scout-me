import { listScoutingAthletes } from './service.js';

export async function athletes(request, response) {
  const accounts = await listScoutingAthletes(request.userId);

  return response.status(200).json({ athletes: accounts });
}
