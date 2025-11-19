import AppClient from "@/components/AppClient";
import { getEndpoints } from "@/lib/endpoints";

export default function Home() {
  const endpoints = getEndpoints();
  return (
    <div className="min-h-screen bg-black text-white">
      <AppClient endpoints={endpoints} />
    </div>
  );
}
