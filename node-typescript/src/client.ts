import dotenv from 'dotenv';
import Worqhat from 'worqhat';

dotenv.config();

export const API_KEY = process.env.API_KEY || '';

export const client = new Worqhat({
  apiKey: API_KEY,
});

export function requireKey() {
  if (!API_KEY) {
    throw new Error('API_KEY is not set. Create a .env file or export API_KEY.');
  }
}
