export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type EndpointCategory =
  | "system"
  | "database"
  | "workflows"
  | "storage";

export type EndpointDefinition = {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  summary: string;
  category: EndpointCategory;
  requestApiCode: string;
  requestSdkCode: string;
  samplePayload?: Record<string, unknown> | null;
  mockResponse?: unknown;
  useUserEmail?: boolean;
};

