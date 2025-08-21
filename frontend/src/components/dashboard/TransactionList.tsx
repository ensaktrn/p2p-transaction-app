"use client";

import { useTransactions } from "@/hooks/useTransactions";

type Tx =
  | { id: number; type: "topup"; amount: number; date: string }
  | { id: number; type: "sent"; amount: number; date: string; to: string }
  | { id: number; type: "received"; amount: number; date: string; from: string };

export default function TransactionList() {
  const { txs, isLoading, error } = useTransactions();

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-600 text-sm">Failed to load transactions.</p>;
  if (!txs || txs.length === 0) {
    return (
      <div className="mt-6 bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Transaction History</h2>
        <p className="text-gray-500">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Transaction History</h2>
      <ul className="space-y-3">
        {txs.map((tx: Tx) => {
          const dateStr = new Date(tx.date).toLocaleString("tr-TR");
          if (tx.type === "topup") {
            return (
              <li key={tx.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
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
              <li key={tx.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                <div>
                  <p className="text-sm text-red-600">- {tx.amount} ₺ → {tx.to}</p>
                  <p className="text-xs text-gray-500">{dateStr}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Sent</span>
              </li>
            );
          }
          return (
            <li key={tx.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <div>
                <p className="text-sm text-green-600">+ {tx.amount} ₺ ← {tx.from}</p>
                <p className="text-xs text-gray-500">{dateStr}</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Received</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
