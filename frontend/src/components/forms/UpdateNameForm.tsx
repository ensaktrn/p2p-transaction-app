"use client";

import { useState } from "react";
import { updateName } from "@/services/users";

export default function UpdateNameForm({ userId, currentName, onSuccess }: {
  userId: number;
  currentName?: string | null;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState(currentName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    try {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Name cannot be empty.");
      if (trimmed === (currentName ?? "")) {
        setSuccess("Nothing to update.");
        return;
      }
      setSaving(true);
      await updateName(userId, trimmed);
      setSuccess("Name updated successfully.");
      onSuccess?.();
    } catch (e: any) {
      setError(e.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Your name"
        className="border border-gray-300 rounded-lg p-2 w-full"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  );
}
