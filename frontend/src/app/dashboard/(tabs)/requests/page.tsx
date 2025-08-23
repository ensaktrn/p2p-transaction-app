"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendMoneyRequest, listMoneyRequests, updateMoneyRequest } from "@/services/moneyRequest";
import { toast } from "sonner";

export default function RequestsPage() {
  const sp = useSearchParams();
  const toParam = sp.get("to");

  // form state
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // lists
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    if (toParam) setTo(toParam);
  }, [toParam]);

  const refresh = async () => {
    setLoadingLists(true);
    try {
      const [inc, out] = await Promise.all([
        listMoneyRequests("incoming", "PENDING"),
        listMoneyRequests("outgoing", "PENDING"),
      ]);
      setIncoming(inc);
      setOutgoing(out);
    } catch (e:any) {
      toast.error(e.message || "Failed to load requests");
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!to.trim()) throw new Error("Enter email or user ID.");
      if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount.");
      setLoading(true);

      if (to.includes("@")) await sendMoneyRequest({ toEmail: to.trim(), amount: Number(amount), note: note.trim() || undefined });
      else {
        const idNum = Number(to);
        if (!Number.isFinite(idNum) || idNum <= 0) throw new Error("User ID must be numeric.");
        await sendMoneyRequest({ toUserId: idNum, amount: Number(amount), note: note.trim() || undefined });
      }

      toast.success("Money request sent");
      setAmount(""); setNote("");
      refresh();
    } catch (e:any) {
      toast.error(e.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const act = async (id:number, action:"PAY"|"REJECT"|"CANCEL") => {
    try {
      await updateMoneyRequest(id, action);
      toast.success(`Request ${action.toLowerCase()}ed`);
      refresh();
    } catch (e:any) {
      toast.error(e.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Request Money</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Friend (email or user ID)</label>
            <input
              value={to}
              onChange={(e)=>setTo(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              placeholder="friend@example.com or 42"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e)=>setAmount(e.target.value===""? "": Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Note (optional)</label>
            <input
              value={note}
              onChange={(e)=>setNote(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
              placeholder="Dinner share, etc."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Incoming (Pending)</h3>
          {loadingLists ? <p>Loading...</p> : incoming.length ? (
            <ul className="divide-y divide-gray-200">
              {incoming.map((r:any)=>(
                <li key={r.id} className="py-3 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">{r.from?.name ?? r.from?.email}</p>
                    <p className="text-gray-500">{r.amount} ₺ — {r.note ?? "-"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>act(r.id,"PAY")} className="text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2">Pay</button>
                    <button onClick={()=>act(r.id,"REJECT")} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">No incoming requests.</p>}
        </div>

        <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Outgoing (Pending)</h3>
          {loadingLists ? <p>Loading...</p> : outgoing.length ? (
            <ul className="divide-y divide-gray-200">
              {outgoing.map((r:any)=>(
                <li key={r.id} className="py-3 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">{r.to?.name ?? r.to?.email}</p>
                    <p className="text-gray-500">{r.amount} ₺ — {r.note ?? "-"}</p>
                  </div>
                  <button onClick={()=>act(r.id,"CANCEL")} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2">Cancel</button>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">No outgoing requests.</p>}
        </div>
      </div>
    </div>
  );
}
