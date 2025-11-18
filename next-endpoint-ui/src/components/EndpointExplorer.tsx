"use client";

import { useEffect, useMemo, useState } from "react";
import type { EndpointDefinition } from "@/types/endpoints";

type ExplorerProps = {
  endpoints: EndpointDefinition[];
};

type TabId = "api" | "sdk";

const tabs: { id: TabId; label: string }[] = [
  { id: "api", label: "Test via API" },
  { id: "sdk", label: "Test via SDK" },
];

type ResponseState = {
  status: "idle" | "loading" | "success" | "error";
  statusCode?: number;
  statusText?: string;
  source?: string;
  body?: unknown;
  timestamp?: string;
};

export default function EndpointExplorer({ endpoints }: ExplorerProps) {
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<TabId>("api");
  const [responseState, setResponseState] = useState<ResponseState>({
    status: "idle",
  });

  const selectedEndpoint = useMemo(
    () => endpoints.find((endpoint) => endpoint.id === selectedId),
    [endpoints, selectedId]
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
          body: JSON.stringify({ endpointId: selectedEndpoint.id }),
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
  }, [selectedEndpoint]);

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
  const lastUpdated =
    responseState.timestamp &&
    new Date(responseState.timestamp).toLocaleTimeString();

  return (
    <div className="min-h-screen bg-[#050A30] px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-3xl border border-white/10 bg-[#0C1649] p-4 lg:max-w-xs">
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Endpoints</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/70">
              {endpoints.length} total
            </span>
          </div>
          <div className="space-y-2">
            {endpoints.map((endpoint) => {
              const isActive = endpoint.id === selectedEndpoint.id;
              return (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedId(endpoint.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-[#FDCEB0]/60 bg-[#1A4289]/60 text-white"
                      : "border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#FDCEB0]">
                    <MethodBadge method={endpoint.method} />
                    <span>{endpoint.path}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {endpoint.name}
                  </p>
                  <p className="text-xs text-white/60">{endpoint.summary}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-1 flex-col gap-6">
          <article className="rounded-3xl border border-white/10 bg-[#0C1649] p-6 shadow-2xl shadow-black/50">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <MethodBadge method={selectedEndpoint.method} size="lg" />
                  <span className="text-lg font-semibold">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/70">
                  {selectedEndpoint.summary}
                </p>
              </div>
              <span className="rounded-full border border-[#FDCEB0]/40 bg-[#FDCEB0]/10 px-4 py-1 text-xs uppercase tracking-wide text-[#FDCEB0]">
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
                        ? "bg-[#FDCEB0] text-[#050A30]"
                        : "border border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-[#FDCEB0]">
                {codeSnippet}
              </pre>
            </div>
          </article>

          <article className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-[#0C1649] p-6 shadow-2xl shadow-black/50">
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                  Live Response
                </p>
                <p className="text-xs text-white/60">
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
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70 md:flex-row">
              <div className="flex-1 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
                  <span>Status</span>
                  <span className="text-white">
                    {responseState.statusCode ?? "—"}{" "}
                    {responseState.statusText ?? ""}
                  </span>
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Source: {responseState.source ?? "—"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Updated: {lastUpdated ?? "—"}
                </div>
              </div>
              <div className="flex-1 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 text-xs text-white/70">
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap leading-6 text-[#FDCEB0]">
                  {formattedResponse}
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

