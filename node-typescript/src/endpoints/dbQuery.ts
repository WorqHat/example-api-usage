import { client } from '../client';

// Placeholder: POST /db/query with optional limit/offset as query params
export async function dbQuery(sql: string, limit?: number, offset?: number) {
  const params: Record<string, number> = {};
  if (typeof limit === 'number') params.limit = limit;
  if (typeof offset === 'number') params.offset = offset;
  const { data } = await client.post('/db/query', { query: sql }, { params });
  console.log(data);
}
