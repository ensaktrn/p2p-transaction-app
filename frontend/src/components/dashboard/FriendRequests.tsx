"use client";

import { useFriendRequests, REQ_INCOMING, REQ_OUTGOING } from "@/hooks/useFriendRequests";
import { updateFriendRequest } from "@/services/friends";
import { toast } from "sonner";
import { mutate } from "swr";

export default function FriendRequests({ mode }: { mode: "incoming" | "outgoing" }) {
  const { incoming, outgoing, loading, error, mutateIncoming, mutateOutgoing } = useFriendRequests();
  const list = mode === "incoming" ? incoming : outgoing;
  const title = mode === "incoming" ? "Incoming Requests" : "Outgoing Requests";

  if (loading) return <p>Loading {title.toLowerCase()}...</p>;
  if (error) return <p className="text-red-600 text-sm">Failed to load {title.toLowerCase()}.</p>;

  const handle = async (id: number, action: "ACCEPT" | "REJECT" | "CANCEL") => {
    // optimistic update (status değiştir)
    const mutateFn = mode === "incoming" ? mutateIncoming : mutateOutgoing;
    const key = mode === "incoming" ? REQ_INCOMING : REQ_OUTGOING;

    mutateFn(prev => prev.map((r:any)=> r.id===id ? { ...r, status: action==="ACCEPT" ? "ACCEPTED" : action==="REJECT" ? "REJECTED" : "CANCELED" } : r));
    try {
      await updateFriendRequest(id, action);
      toast.success(`Request ${action.toLowerCase()}ed`);
      mutate(key);
      // ACCEPT sonrası friends list de yenilensin
      if (action === "ACCEPT") {
        const FRIENDS_KEY = `${process.env.NEXT_PUBLIC_API_BASE_URL}/friends`;
        mutate(FRIENDS_KEY);
      }
    } catch (e:any) {
      toast.error(e.message || "Failed to update request");
      mutate(key); // rollback/revalidate
    }
  };

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {!list.length ? (
        <p className="text-gray-500 text-sm">No {title.toLowerCase()}.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {list.map((r:any)=> {
            const actor = mode==="incoming" ? r.from : r.to;
            const label = (actor.name ?? actor.email) + " • " + actor.email;
            return (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{label}</p>
                  <p className="text-gray-500">Status: {r.status}</p>
                </div>
                <div className="flex gap-2">
                  {mode==="incoming" ? (
                    <>
                      <button
                        onClick={()=>handle(r.id,"ACCEPT")}
                        disabled={r.status!=="PENDING"}
                        className="text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={()=>handle(r.id,"REJECT")}
                        disabled={r.status!=="PENDING"}
                        className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={()=>handle(r.id,"CANCEL")}
                      disabled={r.status!=="PENDING"}
                      className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
