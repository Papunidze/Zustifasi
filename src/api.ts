import type { ApiResponse, LinkPayload, ManualPayload } from "./types";

const BASE = "/api/v1/calculate";

async function post(endpoint: string, body: unknown): Promise<ApiResponse> {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json: ApiResponse = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Request failed (${res.status})`);
  }

  return json;
}

export function calculateByLink(payload: LinkPayload): Promise<ApiResponse> {
  return post("/link", payload);
}

export function calculateManual(payload: ManualPayload): Promise<ApiResponse> {
  return post("/manual", payload);
}
