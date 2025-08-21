import { authFetch } from "@/lib/authFetch";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export async function topup(payload: { cardId: number; amount: number }) {
  const res = await authFetch(`${BASE}/topup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.message || body?.error || `Top up failed (${res.status})`);
  return body as { message: string; newBalance: number };
}

export async function transfer(payload: { amount: number; receiverEmail?: string; receiverId?: number }) {
  const res = await authFetch(`${BASE}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.message || body?.error || `Transfer failed (${res.status})`);
  return body as { message: string };
}
