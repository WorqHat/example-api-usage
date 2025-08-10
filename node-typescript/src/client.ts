import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const API_URL = process.env.API_URL || 'http://localhost:3000';
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
