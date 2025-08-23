"use client";

import { useState } from "react";
import { useTxFiltered } from "@/hooks/useTxFiltered";

export default function TransactionList() {
  const [range, setRange] = useState<"10" | "1m" | "3m">("10");
  const [type, setType] = useState<"all" | "topup" | "sent" | "received">("all");

  const params =
    range === "10" ? { limit: 10, type }
    : range === "1m" ? { months: 1 as const, type }
    : { months: 3 as const, type };

  const { items, isLoading, error } = useTxFiltered(params);

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select value={range} onChange={(e)=>setRange(e.target.value as any)} className="border rounded p-2 text-sm">
          <option value="10">Last 10</option>
          <option value="1m">Last 1 month</option>
          <option value="3m">Last 3 months</option>
        </select>
        <select value={type} onChange={(e)=>setType(e.target.value as any)} className="border rounded p-2 text-sm">
          <option value="all">All</option>
          <option value="topup">Top-Up</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">Failed to load transactions.</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No transactions.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((tx: any) => {
            const dateStr = new Date(tx.date).toLocaleString("tr-TR");
            if (tx.type === "topup") {
              return (
                <li key={tx.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="text-sm text-green-600">+ {tx.amount} ₺ ← Top-Up</p>
                    <p className="text-xs text-gray-500">{dateStr}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Top-Up</span>
                </li>
              );
            }
            if (tx.type === "sent") {
              return (
                <li key={tx.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="text-sm text-red-600">- {tx.amount} ₺ → {tx.to}</p>
                    <p className="text-xs text-gray-500">{dateStr}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Sent</span>
                </li>
              );
            }
            return (
              <li key={tx.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm text-green-600">+ {tx.amount} ₺ ← {tx.from}</p>
                  <p className="text-xs text-gray-500">{dateStr}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Received</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
