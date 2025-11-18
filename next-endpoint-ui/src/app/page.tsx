import EndpointExplorer from "@/components/EndpointExplorer";
import { getEndpoints } from "@/lib/endpoints";

export default function Home() {
  const endpoints = getEndpoints();
  return <EndpointExplorer endpoints={endpoints} />;
}
