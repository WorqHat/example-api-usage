import { client } from '../client';

// Placeholder: POST /db/nl-query
export async function dbNlQuery(question: string, table: string) {
  const { data } = await client.post('/db/nl-query', { question, table });
  console.log(data);
}
