import dotenv from 'dotenv';
import Worqhat from 'worqhat';

dotenv.config();

const API_KEY = process.env.API_KEY || '';

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function checkHealth() {
  const response = await client.health.check();
  console.log(response);
}

// Sample Response
// {
//   status: 'ok',
//   uptime: 311566,
//   version: '1.0.0',
//   environment: 'production',
//   timestamp: '2025-08-12T10:52:01.544Z',
//   memory: { rss: 110, heapTotal: 29, heapUsed: 22, external: 3 },
//   services: { database: 'ok', api: 'ok' }
// }