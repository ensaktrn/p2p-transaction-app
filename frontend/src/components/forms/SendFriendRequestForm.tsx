"use client";

import { useState } from "react";
import { sendFriendRequest } from "@/services/friends";
import { toast } from "sonner";
import { mutate } from "swr";
import { REQ_OUTGOING } from "@/hooks/useFriendRequests";

export default function SendFriendRequestForm() {
  const [emailOrId, setEmailOrId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      if (!emailOrId.trim()) throw new Error("Enter email or user ID.");
      setLoading(true);
      if (emailOrId.includes("@")) {
        await sendFriendRequest({ toEmail: emailOrId.trim() });
      } else {
        const idNum = Number(emailOrId);
        if (!Number.isFinite(idNum) || idNum<=0) throw new Error("User ID must be numeric.");
        await sendFriendRequest({ toUserId: idNum });
      }
      toast.success("Friend request sent");
      setEmailOrId("");
      mutate(REQ_OUTGOING);
    } catch (e:any) {
      setErr(e.message || "Failed to send request");
      toast.error(e.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Send Friend Request</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={emailOrId}
          onChange={(e)=>setEmailOrId(e.target.value)}
          placeholder="friend@example.com or 42"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
    </div>
  );
}
