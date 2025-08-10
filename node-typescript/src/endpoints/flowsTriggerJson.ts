import { client } from '../client';

// Placeholder: POST /flows/trigger/:flowId with JSON body
export async function triggerFlowJson(flowId: string, body: Record<string, unknown> = {}) {
  const { data } = await client.post(`/flows/trigger/${flowId}`, body);
  console.log(data);
}
