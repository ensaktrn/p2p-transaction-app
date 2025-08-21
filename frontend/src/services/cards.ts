import { authFetch } from "@/lib/authFetch";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export type CardListItem = {
  id: number;
  last4: string;
  brand?: string;
  nameOnCard: string;
  expMonth: number;
  expYear: number;
};

export async function fetchCards(): Promise<CardListItem[]> {
  const res = await authFetch(`${BASE}/cards`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addCard(payload: {
  cardNumber: string;
  cvv: string;
  expMonth: number;
  expYear: number;
  nameOnCard: string;
}) {
  const res = await authFetch(`${BASE}/card`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.message || body?.error || `Add card failed (${res.status})`);
  return body as { message: string; cardId: number };
}
