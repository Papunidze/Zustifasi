import type { ApiResponse, LinkPayload, ManualPayload, CustomsPayload, VinDecoded, VinResponse } from "./types";

const BASE = "/api/v1/calculate";
const VIN_BASE = "/api/v1/vin";

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

export function calculateCustoms(payload: CustomsPayload): Promise<ApiResponse> {
  return post("/customs", payload);
}

export async function decodeVin(vin: string): Promise<VinDecoded> {
  const res = await fetch(`${VIN_BASE}/${encodeURIComponent(vin)}`);
  const json: VinResponse = await res.json();
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.error ?? `VIN lookup failed (${res.status})`);
  }
  return json.data;
}
