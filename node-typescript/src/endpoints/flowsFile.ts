import { client } from '../client';
import FormData from 'form-data';
import fs from 'fs';

// Placeholder: POST /flows/file/:flowId with file or url
export async function triggerFlowWithFile(flowId: string, filePath: string, metadata?: Record<string, unknown>) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  if (metadata) form.append('metadata', JSON.stringify(metadata));
  const { data } = await client.post(`/flows/file/${flowId}`, form, { headers: form.getHeaders() });
  console.log(data);
}

export async function triggerFlowWithUrl(flowId: string, url: string, metadata?: Record<string, unknown>) {
  const form = new FormData();
  form.append('url', url);
  if (metadata) form.append('metadata', JSON.stringify(metadata));
  const { data } = await client.post(`/flows/file/${flowId}`, form, { headers: form.getHeaders() });
  console.log(data);
}
