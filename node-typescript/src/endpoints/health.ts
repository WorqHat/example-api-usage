import { client } from '../client';

// Placeholder: GET /health
export async function checkHealth() {
  const { data } = await client.get('/health');
  console.log(data);
}
