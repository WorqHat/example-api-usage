import { NextResponse } from "next/server";
import { getEndpointById } from "@/lib/endpoints";

type RunRequest = {
  endpointId: string;
  userEmail?: string | null;
};

export async function POST(request: Request) {
  try {
    const { endpointId, userEmail }: RunRequest = await request.json();

    if (!endpointId) {
      return NextResponse.json(
        { ok: false, error: "endpointId is required" },
        { status: 400 }
      );
    }

    const endpoint = getEndpointById(endpointId);

    if (!endpoint) {
      return NextResponse.json(
        { ok: false, error: `Unknown endpoint: ${endpointId}` },
        { status: 404 }
      );
    }

    const apiKey = process.env.WORQHAT_API_KEY;
    const baseUrl = process.env.WORQHAT_API_BASE_URL ?? "https://api.worqhat.com";

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        source: "mock",
        status: 200,
        statusText: "Mocked response",
        data:
          endpoint.mockResponse ??
          ({
            message:
              "Set WORQHAT_API_KEY in .env.local for live calls. Showing mock response instead.",
          } as const),
      });
    }

    const url = new URL(endpoint.path, baseUrl).toString();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    };

    if (userEmail) {
      headers["X-Requester-Email"] = userEmail;
    }

    if (endpoint.samplePayload) {
      headers["Content-Type"] = "application/json";
    }

    const bodyPayload = endpoint.samplePayload
      ? preparePayload(endpoint.samplePayload, endpoint.useUserEmail, userEmail)
      : undefined;

    const upstreamResponse = await fetch(url, {
      method: endpoint.method,
      headers,
      body: bodyPayload ? JSON.stringify(bodyPayload) : undefined,
      cache: "no-store",
    });

    const textPayload = await upstreamResponse.text();
    let parsedPayload: unknown = textPayload;

    try {
      parsedPayload = JSON.parse(textPayload);
    } catch {
      // ignore parse errors, keep raw text
    }

    return NextResponse.json(
      {
        ok: upstreamResponse.ok,
        source: "live",
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        data: parsedPayload,
        context: userEmail ? { userEmail } : undefined,
      },
      { status: upstreamResponse.status }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json(
      {
        ok: false,
        source: "error",
        error: message,
      },
      { status: 500 }
    );
  }
}

function preparePayload(
  basePayload: Record<string, unknown>,
  useUserEmail: boolean | undefined,
  userEmail: string | null | undefined
) {
  if (!useUserEmail) {
    return basePayload;
  }

  return {
    ...basePayload,
    email: userEmail ?? "support@worqhat.com",
  };
}

