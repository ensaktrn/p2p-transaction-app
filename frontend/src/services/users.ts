import { authFetch } from "@/lib/authFetch";
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export type UserResp = { id: number; email: string; name?: string | null; balance: number };

export async function getMe(): Promise<UserResp> {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("No session");
  const res = await authFetch(`${BASE}/users/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateName(userId: number, name: string) {
  const res = await authFetch(`${BASE}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.message || body?.error || `Update failed (${res.status})`);
  return body;
}

export async function changePassword(userId: number, payload: { currentPassword: string; newPassword: string }) {
  const res = await authFetch(`${BASE}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: payload.currentPassword, newPassword: payload.newPassword }),
  });
  const body = await res.json().catch(async () => ({ message: await res.text().catch(()=> "") }));
  if (!res.ok) throw new Error(body?.message || body?.error || `Password change failed (${res.status})`);
  return body;
}
