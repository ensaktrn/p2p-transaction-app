"use client";

import { useState } from "react";
import SendFriendRequestForm from "@/components/forms/SendFriendRequestForm";
import FriendsList from "@/components/dashboard/FriendList";
import FriendRequests from "@/components/dashboard/FriendRequests";

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends"|"incoming"|"outgoing"|"send">("friends");

  const tabs: {key: typeof tab; label: string}[] = [
    { key: "friends",  label: "Friends" },
    { key: "incoming", label: "Incoming Requests" },
    { key: "outgoing", label: "Outgoing Requests" },
    { key: "send",     label: "Send Request" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={()=>setTab(t.key)}
            className={`px-3 py-2 rounded-lg text-sm ${tab===t.key ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab==="friends"  && <FriendsList />}
      {tab==="incoming" && <FriendRequests mode="incoming" />}
      {tab==="outgoing" && <FriendRequests mode="outgoing" />}
      {tab==="send"     && <SendFriendRequestForm />}
    </div>
  );
}
