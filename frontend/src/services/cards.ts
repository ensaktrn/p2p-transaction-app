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
  const res = await fetch(`${BASE}/cards`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
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
  const res = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ message: string; cardId: number }>;
}
