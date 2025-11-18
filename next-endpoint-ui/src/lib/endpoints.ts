import type { EndpointDefinition } from "@/types/endpoints";
import endpointsData from "../../data/endpoints.json";

const endpoints = endpointsData as EndpointDefinition[];

export function getEndpoints(): EndpointDefinition[] {
  return endpoints;
}

export function getEndpointById(id: string): EndpointDefinition | undefined {
  return endpoints.find((endpoint) => endpoint.id === id);
}

