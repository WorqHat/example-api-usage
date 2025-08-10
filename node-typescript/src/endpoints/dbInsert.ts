import { client } from '../client';

// Placeholder: POST /db/insert
export async function dbInsert(table: string, data: unknown) {
  const { data: resp } = await client.post('/db/insert', { table, data });
  console.log(resp);
}
