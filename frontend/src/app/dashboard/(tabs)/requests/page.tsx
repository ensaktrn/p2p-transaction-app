"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { sendMoneyRequest, updateMoneyRequest } from "@/services/moneyRequest";
import { useMoneyRequests, MRStatus, Range } from "@/hooks/useMoneyRequests";
import { mutate } from "swr";
import { mutateWallet } from "@/lib/mutateWallet"; // sende varsa; yoksa revalidate'ı geçebilirsin

export default function RequestsPage() {
  const sp = useSearchParams();
  const toParam = sp.get("to");

  // form
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // filtreler
  const [range, setRange] = useState<Range>("10");
  const [incomingStatus, setIncomingStatus] = useState<MRStatus>("PENDING");
  const [outgoingStatus, setOutgoingStatus] = useState<MRStatus>("PENDING");

  // listeler
  const inc = useMoneyRequests("incoming", incomingStatus, range);
  const out = useMoneyRequests("outgoing", outgoingStatus, range);

  useEffect(() => { if (toParam) setTo(toParam); }, [toParam]);

  // istek oluşturma
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!to.trim()) throw new Error("Enter email or user ID.");
      if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount.");
      setLoading(true);

      if (to.includes("@")) {
        await sendMoneyRequest({ toEmail: to.trim(), amount: Number(amount), note: note.trim() || undefined });
      } else {
        const idNum = Number(to);
        if (!Number.isFinite(idNum) || idNum <= 0) throw new Error("User ID must be numeric.");
        await sendMoneyRequest({ toUserId: idNum, amount: Number(amount), note: note.trim() || undefined });
      }

      toast.success("Money request sent");
      setAmount(""); setNote("");
      out.refresh(); // outgoing listemde gözüksün
      if (incomingStatus === "PENDING") inc.refresh(); // filtreye göre
    } catch (e:any) {
      toast.error(e.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  // aksiyonlar (PAY/REJECT/CANCEL)
  const act = async (r:any, action:"PAY"|"REJECT"|"CANCEL") => {
    try {
      await updateMoneyRequest(r.id, action);
      toast.success(`Request ${action.toLowerCase()}ed`);

     if (action === "PAY") {
        // payer sensin → balance’ı anında güncelle
        if (typeof r.amount === "number") mutateWallet(-r.amount);
        // mutateWallet zaten TX listelerini de tetikliyor (senin mevcut implementasyonunda)
      }

      inc.refresh();
      out.refresh();
    } catch (e:any) {
      toast.error(e.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Request form */}
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
              onChange={(e)=>setAmount(e.target.value === "" ? "" : Number(e.target.value))}
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Range</span>
            <select value={range} onChange={(e)=>setRange(e.target.value as Range)} className="border rounded p-2 text-sm">
              <option value="10">Last 10</option>
              <option value="1m">Last 1 month</option>
              <option value="3m">Last 3 months</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Incoming</span>
            <select value={incomingStatus} onChange={(e)=>setIncomingStatus(e.target.value as MRStatus)} className="border rounded p-2 text-sm">
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELED">Canceled</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Outgoing</span>
            <select value={outgoingStatus} onChange={(e)=>setOutgoingStatus(e.target.value as MRStatus)} className="border rounded p-2 text-sm">
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELED">Canceled</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incoming list */}
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h3 className="font-semibold mb-2">Incoming ({incomingStatus})</h3>
        {inc.isLoading ? <p>Loading...</p> :
         inc.error ? <p className="text-red-600 text-sm">Failed to load incoming.</p> :
         inc.items.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {inc.items.map((r:any)=>(
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{r.from?.name ?? r.from?.email}</p>
                  <p className="text-gray-500">{r.amount} ₺ — {r.note ?? "-"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={()=>act(r,"PAY")}
                    disabled={r.status !== "PENDING"}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 disabled:opacity-50"
                  >
                    Pay
                  </button>
                  <button
                    onClick={()=>act(r,"REJECT")}
                    disabled={r.status !== "PENDING"}
                    className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">No incoming requests.</p>}
      </div>

      {/* Outgoing list */}
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h3 className="font-semibold mb-2">Outgoing ({outgoingStatus})</h3>
        {out.isLoading ? <p>Loading...</p> :
         out.error ? <p className="text-red-600 text-sm">Failed to load outgoing.</p> :
         out.items.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {out.items.map((r:any)=>(
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{r.to?.name ?? r.to?.email}</p>
                  <p className="text-gray-500">{r.amount} ₺ — {r.note ?? "-"}</p>
                </div>
                <button
                  onClick={()=>act(r,"CANCEL")}
                  disabled={r.status !== "PENDING"}
                  className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 disabled:opacity-50"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">No outgoing requests.</p>}
      </div>
    </div>
  );
}
