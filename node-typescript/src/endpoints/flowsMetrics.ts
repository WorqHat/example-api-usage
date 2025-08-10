import { client } from '../client';

// Placeholder: GET /flows/metrics
export async function getFlowsMetrics(params?: { start_date?: string; end_date?: string; status?: 'completed' | 'failed' | 'in_progress' }) {
  const { data } = await client.get('/flows/metrics', { params });
  console.log(data);
}
