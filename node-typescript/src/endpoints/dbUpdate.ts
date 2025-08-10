import { client } from '../client';

// Placeholder: PUT /db/update
export async function dbUpdate(table: string, where: Record<string, unknown>, data: Record<string, unknown>) {
  const { data: resp } = await client.put('/db/update', { table, where, data });
  console.log(resp);
}
