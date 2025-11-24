"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EndpointCategory, EndpointDefinition } from "@/types/endpoints";

type ExplorerProps = {
  endpoints: EndpointDefinition[];
  userEmail?: string;
};

type TabId = "api" | "sdk";

const tabs: { id: TabId; label: string }[] = [
  { id: "api", label: "Test via API" },
  { id: "sdk", label: "Test via SDK" },
];

type SectionMeta = {
  id: EndpointCategory;
  label: string;
  description: string;
};

const sections: SectionMeta[] = [
  {
    id: "system",
    label: "System",
    description: "Platform health, status and heartbeat checks.",
  },
  {
    id: "database",
    label: "Database",
    description: "Direct data mutations powered by WorqHat tables.",
  },
  {
    id: "workflows",
    label: "Workflows",
    description: "Automation triggers and flow orchestration.",
  },
  {
    id: "storage",
    label: "Storage",
    description: "Files, assets and bucket-level operations.",
  },
];

type ResponseState = {
  status: "idle" | "loading" | "success" | "error";
  statusCode?: number;
  statusText?: string;
  source?: string;
  body?: unknown;
  timestamp?: string;
};

export default function EndpointExplorer({
  endpoints,
  userEmail,
}: ExplorerProps) {
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<TabId>("api");
  const prevEndpointIdRef = useRef<string | null>(null);
  
  // Initialize response state with sample data
  const initialResponseState = useMemo(() => {
    const endpoint = endpoints.find((e) => e.id === selectedId);
    return {
      status: "idle" as const,
      source: "sample" as const,
      body: endpoint?.mockResponse ?? null,
    };
  }, [endpoints, selectedId]);
  
  const [responseState, setResponseState] = useState<ResponseState>(initialResponseState);
  const [hasRunOnce, setHasRunOnce] = useState(false);

  const selectedEndpoint = useMemo(
    () => endpoints.find((endpoint) => endpoint.id === selectedId),
    [endpoints, selectedId]
  );

  const groupedSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        endpoints: endpoints.filter(
          (endpoint) => endpoint.category === section.id
        ),
      })),
    [endpoints]
  );

  const codeSnippet =
    activeTab === "api"
      ? selectedEndpoint?.requestApiCode ?? ""
      : selectedEndpoint?.requestSdkCode ?? "";

  // Reset to sample response when endpoint changes
  useEffect(() => {
    if (!selectedEndpoint) return;
    
    const currentId = selectedEndpoint.id;
    if (prevEndpointIdRef.current !== currentId) {
      prevEndpointIdRef.current = currentId;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setResponseState({
          status: "idle",
          source: "sample",
          body: selectedEndpoint.mockResponse ?? null,
        });
        setHasRunOnce(false);
      }, 0);
    }
  }, [selectedEndpoint]);

  const handleRunRequest = async () => {
    if (!selectedEndpoint) return;

    setResponseState({ status: "loading" });
    setHasRunOnce(true);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpointId: selectedEndpoint.id,
          userEmail: userEmail ?? null,
        }),
      });

      const payload = await response.json();

      setResponseState({
        status: response.ok ? "success" : "error",
        statusCode: payload.status ?? response.status,
        statusText: payload.statusText ?? response.statusText,
        source: payload.source ?? "live",
        body: payload.data ?? payload.error ?? payload,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setResponseState({
        status: "error",
        source: "client",
        body: {
          message:
            error instanceof Error
              ? error.message
              : "Unknown client-side error",
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  if (!endpoints.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050A30] text-lg text-[#FDCEB0]">
        Provide at least one endpoint in `data/endpoints.json` to get started.
      </div>
    );
  }

  if (!selectedEndpoint) {
    return null;
  }

  const responseBadge = getResponseBadge(responseState.status);
  const formattedResponse = formatPayload(responseState.body);
  const isLoading = responseState.status === "loading";
  const responseContent = isLoading
    ? `Requesting ${selectedEndpoint.name} from WorqHat...`
    : formattedResponse || "No response data available.";
  const lastUpdated =
    responseState.timestamp &&
    new Date(responseState.timestamp).toLocaleTimeString();

  return (
    <div className="flex min-h-screen text-white">
      <aside className="sticky top-16 h-[calc(100vh-1rem)] w-full overflow-y-auto border-r border-white/10 bg-black/50 pt-4 px-6 pb-6 lg:max-w-[280px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-6">
          {groupedSections.map((section) => (
            <div key={section.id}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.endpoints.length === 0 ? (
                  <div className="rounded-md px-3 py-2 text-sm text-white/40">
                    Coming soon
                  </div>
                ) : (
                  section.endpoints.map((endpoint) => {
                    const isActive = endpoint.id === selectedEndpoint.id;
                    return (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedId(endpoint.id)}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MethodBadge method={endpoint.method} />
                          <span className="text-xs">
                            {formatPathForDisplay(endpoint.path)}
                          </span>
                        </div>
                        <p className="mt-1 font-semibold">{endpoint.name}</p>
                        <p className="mt-0.5 text-xs text-white/50">
                          {endpoint.summary}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <MethodBadge method={selectedEndpoint.method} size="lg" />
                <span className="text-2xl font-semibold text-white">
                  {formatPathForDisplay(selectedEndpoint.path)}
                </span>
              </div>
              <p className="text-sm text-white/60">
                {selectedEndpoint.summary}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <article className="rounded-lg border border-white/10 bg-black/40 p-6">
              <nav className="mb-4 flex gap-3">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="rounded-lg border border-white/10 bg-black p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-[#FDCEB0]">
                  {codeSnippet}
                </pre>
              </div>
            </article>

            <article className="rounded-lg border border-white/10 bg-black/40 p-6">
              <header className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Response
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    {hasRunOnce
                      ? "Click Run to fetch the latest response."
                      : "Sample response shown. Click Run to fetch live data."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunRequest}
                    disabled={isLoading}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                      isLoading
                        ? "cursor-not-allowed bg-white/5 text-white/40"
                        : "bg-[#1A4289] text-white hover:bg-[#1A4289]/80"
                    }`}
                  >
                    {isLoading ? "Running..." : "Run"}
                  </button>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${responseBadge.className}`}
                  >
                    {responseBadge.label}
                  </span>
                </div>
              </header>
              <div className="flex flex-col gap-4 text-sm md:flex-row">
                <div className="flex-1 rounded-lg border border-white/10 bg-black/40 p-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                    <span>Status</span>
                    {isLoading ? (
                      <LoadingStatus />
                    ) : (
                      <span className="text-white">
                        {responseState.statusCode ?? "—"}{" "}
                        {responseState.statusText ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Source:{" "}
                    {isLoading
                      ? "Contacting WorqHat..."
                      : responseState.source === "sample"
                      ? "Sample"
                      : responseState.source ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    Updated: {isLoading ? "—" : lastUpdated ?? "—"}
                  </div>
                </div>
                <div className="flex-1 rounded-lg border border-dashed border-white/20 bg-black/90 p-4 text-xs">
                  <pre
                    className={`max-h-72 overflow-auto whitespace-pre-wrap leading-6 text-[#FDCEB0] ${
                      isLoading ? "animate-pulse text-[#FDCEB0]/70" : ""
                    }`}
                    aria-live="polite"
                  >
                    {responseContent}
                  </pre>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

type BadgeProps = {
  method: string;
  size?: "sm" | "lg";
};

function MethodBadge({ method, size = "sm" }: BadgeProps) {
  const baseClass =
    "rounded-full bg-[#FDCEB0]/20 text-[#FDCEB0] font-semibold tracking-wide";
  const sizing =
    size === "lg"
      ? "px-3 py-1 text-xs"
      : "px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]";

  return <span className={`${baseClass} ${sizing}`}>{method}</span>;
}

function getResponseBadge(status: ResponseState["status"]) {
  switch (status) {
    case "loading":
      return {
        label: "Running",
        className: "bg-[#1A4289] text-white",
      };
    case "success":
      return {
        label: "Live",
        className: "bg-[#FDCEB0] text-[#050A30]",
      };
    case "error":
      return {
        label: "Error",
        className: "bg-red-500/60 text-white",
      };
    default:
      return {
        label: "Sample",
        className: "bg-white/10 text-white/70",
      };
  }
}

function formatPayload(payload: unknown): string {
  if (payload === undefined || payload === null) {
    return "No response yet.";
  }

  if (typeof payload === "string") {
    return payload;
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}

function LoadingStatus() {
  return (
    <span className="flex items-center gap-2 text-white" aria-live="polite">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#1A4289]" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1A4289]">
        Fetching
      </span>
    </span>
  );
}

function formatPathForDisplay(path: string): string {
  // UUID pattern: 8-4-4-4-12 hex digits
  const uuidPattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
  return path.replace(uuidPattern, "flow-id");
}
