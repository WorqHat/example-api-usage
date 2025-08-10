import { client } from '../client';

// Placeholder: DELETE /db/delete
export async function dbDelete(table: string, where: Record<string, unknown>) {
  const { data } = await client.delete('/db/delete', { data: { table, where } });
  console.log(data);
}
