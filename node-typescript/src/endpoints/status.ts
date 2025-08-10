import { client } from '../client';

// Placeholder: GET /
export async function checkStatus() {
  const { data } = await client.get('/');
  console.log(data);
}
