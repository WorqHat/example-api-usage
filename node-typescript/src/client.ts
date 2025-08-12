import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Per repository rule: do NOT use API_URL env var; use the literal base URL
export const API_URL = 'https://api.worqhat.com';
export const API_KEY = process.env.API_KEY || '';

export const client = axios.create({
  baseURL: API_URL,
  headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
  timeout: 5 * 60 * 1000,
});

export function requireKey() {
  if (!API_KEY) {
    throw new Error('API_KEY is not set. Create a .env file or export API_KEY.');
  }
}
