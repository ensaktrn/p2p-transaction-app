"use client";

import { useEffect, useState } from "react";
import { getMe, type UserResp } from "@/services/users";
import UpdateNameForm from "@/components/forms/UpdateNameForm";
import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";

export default function AccountPage() {
  const [user, setUser] = useState<UserResp | null>(null);
  const [loading, setLoading] = useState(true);

  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshUser = async () => {
    const me = await getMe();
    setUser(me);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wallet:changed"));
    }
  };

  if (loading) return <p>Loading account...</p>;
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <p>Email: {user.email}</p>
        <p>Name: {user.name ?? "-"}</p>
        <p>Balance: ₺ {Number(user.balance ?? 0).toFixed(2)}</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={()=>{setShowNameForm(!showNameForm); setShowPasswordForm(false);}}
            className="bg-gray-100 px-3 py-2 rounded-lg"
          >
            {showNameForm ? "Close" : "Update Name"}
          </button>
          <button
            onClick={()=>{setShowPasswordForm(!showPasswordForm); setShowNameForm(false);}}
            className="bg-gray-100 px-3 py-2 rounded-lg"
          >
            {showPasswordForm ? "Close" : "Update Password"}
          </button>
        </div>
      </div>

      {showNameForm && (
        <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
          <h3 className="text-base font-semibold mb-2">Update Name</h3>
          <UpdateNameForm
            userId={user.id}
            currentName={user.name}
            onSuccess={refreshUser}
          />
        </div>
      )}

      {showPasswordForm && (
        <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
          <h3 className="text-base font-semibold mb-2">Update Password</h3>
          <UpdatePasswordForm
            userId={user.id}
            onSuccess={()=>{}}
          />
        </div>
      )}
    </div>
  );
}
