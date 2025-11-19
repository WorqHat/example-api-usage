"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  EndpointCategory,
  EndpointDefinition,
} from "@/types/endpoints";

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
  const [responseState, setResponseState] = useState<ResponseState>({
    status: "idle",
  });

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
      ? selectedEndpoint.requestApiCode
      : selectedEndpoint.requestSdkCode;

  useEffect(() => {
    if (!selectedEndpoint) return;

    let cancelled = false;

    const runTest = async () => {
      setResponseState({ status: "loading" });

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

        if (cancelled) return;

        setResponseState({
          status: response.ok ? "success" : "error",
          statusCode: payload.status ?? response.status,
          statusText: payload.statusText ?? response.statusText,
          source: payload.source ?? "live",
          body: payload.data ?? payload.error ?? payload,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        if (cancelled) return;

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

    runTest();

    return () => {
      cancelled = true;
    };
  }, [selectedEndpoint, userEmail]);

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
    : formattedResponse;
  const lastUpdated =
    responseState.timestamp &&
    new Date(responseState.timestamp).toLocaleTimeString();

  return (
    <div className="bg-gradient-to-b from-black via-[#050A30] to-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-[#050A30] lg:flex-row">
        <aside className="w-full space-y-4 rounded-3xl border border-black/10 bg-white p-5 shadow-2xl shadow-black/20 lg:max-w-xs">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/50">
            <span>Endpoints</span>
            <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] text-black/60">
              {endpoints.length} total
            </span>
          </div>
          {groupedSections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-black/5 bg-white/60 p-4"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-black/45">
                <span>{section.label}</span>
                <span className="text-black/50">{section.endpoints.length}</span>
              </div>
              <p className="mt-1 text-xs text-black/50">{section.description}</p>
              <div className="mt-3 space-y-3">
                {section.endpoints.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-black/10 bg-white/70 px-4 py-3 text-xs text-black/50">
                    Coming soon
                  </div>
                ) : (
                  section.endpoints.map((endpoint) => {
                    const isActive = endpoint.id === selectedEndpoint.id;
                    return (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedId(endpoint.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-[#050A30] bg-[#050A30] text-white shadow-lg shadow-[#050A30]/30"
                            : "border-black/5 bg-white text-[#050A30] hover:border-[#1A4289]/40 hover:bg-[#f7f8fb]"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#1A4289]">
                          <MethodBadge method={endpoint.method} />
                          <span>{endpoint.path}</span>
                        </div>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            isActive ? "text-white" : "text-[#050A30]"
                          }`}
                        >
                          {endpoint.name}
                        </p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-white/80" : "text-black/60"
                          }`}
                        >
                          {endpoint.summary}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </aside>

        <section className="flex flex-1 flex-col gap-6">
          <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/20">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <MethodBadge method={selectedEndpoint.method} size="lg" />
                  <span className="text-lg font-semibold text-[#050A30]">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <p className="mt-1 text-sm text-black/60">
                  {selectedEndpoint.summary}
                </p>
              </div>
              <span className="rounded-full border border-[#1A4289]/30 bg-[#1A4289]/10 px-4 py-1 text-xs uppercase tracking-wide text-[#1A4289]">
                Request
              </span>
            </header>

            <nav className="mt-4 flex gap-3">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-black text-white shadow-md shadow-black/30"
                        : "border border-black/10 text-black/70 hover:border-black/40 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black p-4">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-[#FDCEB0]">
                {codeSnippet}
              </pre>
            </div>
          </article>

          <article className="flex flex-1 flex-col rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/20">
            <header className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-black/50">
                  Live Response
                </p>
                <p className="text-xs text-black/60">
                  Automatically refreshed whenever you choose a different
                  endpoint.
                </p>
              </div>
              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${responseBadge.className}`}
              >
                {responseBadge.label}
              </span>
            </header>
            <div className="mt-4 flex flex-col gap-3 text-sm text-black/70 md:flex-row">
              <div className="flex-1 rounded-2xl border border-black/10 bg-black/5 p-4">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/50">
                  <span>Status</span>
                  {isLoading ? (
                    <LoadingStatus />
                  ) : (
                    <span className="text-black">
                      {responseState.statusCode ?? "—"}{" "}
                      {responseState.statusText ?? ""}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-black/60">
                  Source:{" "}
                  {isLoading
                    ? "Contacting WorqHat..."
                    : responseState.source ?? "—"}
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Updated: {isLoading ? "—" : lastUpdated ?? "—"}
                </div>
              </div>
              <div className="flex-1 rounded-2xl border border-dashed border-black/15 bg-black/90 p-4 text-xs text-white/80">
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
        </section>
      </div>
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
      ? "px-4 py-1 text-xs"
      : "px-3 py-0.5 text-[10px] uppercase tracking-[0.2em]";

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
        label: "Idle",
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
    <span className="flex items-center gap-2 text-black" aria-live="polite">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#1A4289]" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1A4289]">
        Fetching
      </span>
    </span>
  );
}

