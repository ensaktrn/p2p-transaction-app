"use client";

import { useState } from "react";
import { changePassword } from "@/services/users";

export default function UpdatePasswordForm({ userId, onSuccess }: {
  userId: number;
  onSuccess?: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    try {
      if (!currentPassword || !newPassword || !newPassword2) {
        throw new Error("Please fill all password fields.");
      }
      if (newPassword !== newPassword2) {
        throw new Error("New passwords do not match.");
      }
      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters.");
      }
      setSaving(true);
      await changePassword(userId, { currentPassword, newPassword });
      setSuccess("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setNewPassword2("");
      onSuccess?.();
    } catch (e: any) {
      setError(e.message || "Password change failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mt-1"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mt-1"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          value={newPassword2}
          onChange={(e)=>setNewPassword2(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mt-1"
          required
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Change Password"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  );
}
