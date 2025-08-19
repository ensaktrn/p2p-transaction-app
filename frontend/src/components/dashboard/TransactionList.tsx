"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  type: "sent" | "received";
  amount: number;
  to?: string;
  from?: string;
  date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Transaction fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  if (transactions.length === 0)
    return <p className="text-gray-500">Henüz işlem bulunmamaktadır.</p>;

  return (
    <div className="mt-6 bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">İşlem Geçmişi</h2>
      <ul className="space-y-3">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="flex justify-between items-center border-b border-gray-200 dark:border-gray-300 pb-2"
          >
            <div>
              {tx.type === "sent" ? (
                <p className="text-sm text-red-600">
                  - {tx.amount} ₺ → {tx.to}
                </p>
              ) : (
                <p className="text-sm text-green-600">
                  + {tx.amount} ₺ ← {tx.from}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(tx.date).toLocaleString("tr-TR")}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded ${
                tx.type === "sent"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {tx.type === "sent" ? "Gönderildi" : "Alındı"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
