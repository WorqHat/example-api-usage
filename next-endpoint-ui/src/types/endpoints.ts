export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type EndpointDefinition = {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  summary: string;
  requestApiCode: string;
  requestSdkCode: string;
  samplePayload?: Record<string, unknown> | null;
  mockResponse?: unknown;
};

