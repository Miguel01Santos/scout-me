import { feedQuerySchema } from './schema.js';
import { getFeed } from './service.js';

export async function feed(request, response) {
  const query = feedQuerySchema.parse(request.query);
  const page = await getFeed(request.userId, query);

  return response.status(200).json(page);
}
