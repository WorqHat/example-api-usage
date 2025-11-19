"use client";

import { useCallback, useState } from "react";
import type { EndpointDefinition } from "@/types/endpoints";
import EndpointExplorer from "@/components/EndpointExplorer";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WelcomeModal from "@/components/WelcomeModal";

type AppClientProps = {
  endpoints: EndpointDefinition[];
};

const EMAIL_STORAGE_KEY = "wh-playground-email";

export default function AppClient({ endpoints }: AppClientProps) {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(EMAIL_STORAGE_KEY);
  });
  const [isModalOpen, setIsModalOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.localStorage.getItem(EMAIL_STORAGE_KEY);
  });

  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
    setIsModalOpen(false);
    // TODO: fire API call to persist email server-side when endpoint is ready.
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto">
        <EndpointExplorer endpoints={endpoints} userEmail={userEmail ?? ""} />
      </main>
      <SiteFooter />
      <WelcomeModal
        open={isModalOpen}
        defaultEmail={userEmail ?? ""}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
}

