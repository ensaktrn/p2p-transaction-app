"use client";

import { useEffect, useState } from "react";

type UserResp = { id: number; email: string; balance: number; name?: string | null };

export default function AccountPage() {
  const [user, setUser] = useState<UserResp | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Account</h2>
      {user ? (
        <div className="text-sm text-gray-700">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Name:</span> {user.name ?? "-"}</p>
          <p><span className="font-medium">Balance:</span> ₺ {Number(user.balance ?? 0).toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading account...</p>
      )}
    </div>
  );
}
