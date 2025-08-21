import { authFetch } from "@/lib/authFetch";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export type Friend = { id: number; email: string; name?: string | null; since: string };
export type FriendRequestItem = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  from: { id: number; email: string; name?: string | null };
  to: { id: number; email: string; name?: string | null };
};

export async function listFriends(): Promise<Friend[]> {
  const res = await authFetch(`${BASE}/friends`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function removeFriend(friendUserId: number) {
  const res = await authFetch(`${BASE}/friends/${friendUserId}`, { method: "DELETE" });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.error || body?.message || `Remove failed (${res.status})`);
  return body as { message: string };
}

export async function sendFriendRequest(payload: { toEmail?: string; toUserId?: number }) {
  const res = await authFetch(`${BASE}/friends/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.error || body?.message || `Request failed (${res.status})`);
  return body as FriendRequestItem;
}

export async function listFriendRequests(direction: "incoming" | "outgoing" | "all" = "all") {
  const res = await authFetch(`${BASE}/friends/requests?direction=${direction}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<FriendRequestItem[]>;
}

export async function updateFriendRequest(id: number, action: "ACCEPT" | "REJECT" | "CANCEL") {
  const res = await authFetch(`${BASE}/friends/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.error || body?.message || `Update failed (${res.status})`);
  return body as { id: number; status: string };
}
