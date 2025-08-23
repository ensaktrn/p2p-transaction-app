import { authFetch } from "@/lib/authFetch";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export async function sendMoneyRequest(payload: { toEmail?: string; toUserId?: number; amount: number; note?: string }) {
  const res = await authFetch(`${BASE}/money-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.error || body?.message || `Request failed (${res.status})`);
  return body;
}

export async function listMoneyRequests(direction: "incoming" | "outgoing" | "all" = "all", status?: string) {
  const url = new URL(`${BASE}/money-requests`);
  url.searchParams.set("direction", direction);
  if (status) url.searchParams.set("status", status);
  const res = await authFetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateMoneyRequest(id: number, action: "PAY" | "REJECT" | "CANCEL") {
  const res = await authFetch(`${BASE}/money-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.error || body?.message || `Update failed (${res.status})`);
  return body;
}
