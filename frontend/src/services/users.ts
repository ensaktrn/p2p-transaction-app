const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function authHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export type UserResp = {
  id: number;
  email: string;
  name?: string | null;
  balance: number;
};

export async function getMe(): Promise<UserResp> {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("No session");
  const res = await fetch(`${BASE}/users/${userId}`, { headers: { Authorization: authHeader().Authorization! } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateName(userId: number, name: string) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ name }),
  });
  let body: any; try { body = await res.json(); } catch { body = { message: await res.text().catch(()=> "") }; }
  if (!res.ok) throw new Error(body?.message || body?.error || `Update failed (${res.status})`);
  return body; // updated user or {message}
}

export async function changePassword(userId: number, payload: { currentPassword: string; newPassword: string }) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ currentPassword: payload.currentPassword, newPassword: payload.newPassword }),
  });
  let body: any; try { body = await res.json(); } catch { body = { message: await res.text().catch(()=> "") }; }
  if (!res.ok) throw new Error(body?.message || body?.error || `Password change failed (${res.status})`);
  return body;
}
