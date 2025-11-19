import EndpointExplorer from "@/components/EndpointExplorer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getEndpoints } from "@/lib/endpoints";

export default function Home() {
  const endpoints = getEndpoints();
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">
          <EndpointExplorer endpoints={endpoints} />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
