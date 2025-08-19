const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export type LoginResponse = {
  message: string;
  token: string;
  user: { id: number; email: string; name?: string | null; role: string };
};

export async function loginUser(data: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    const txt = await res.text().catch(() => "");
    body = { message: txt };
  }

  if (!res.ok) {
    const msg = body?.message || body?.error || `Login failed (${res.status})`;
    throw new Error(msg);
  }

  // persist
  localStorage.setItem("token", body.token);
  localStorage.setItem("userId", String(body.user.id));

  return body as LoginResponse; // { message, token, user }
}
  
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};