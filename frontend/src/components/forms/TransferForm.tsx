"use client";

import { useState } from "react";
import { transfer } from "@/services/wallet";

type Props = { onSuccess?: () => void };

export default function TransferForm({ onSuccess }: Props) {
  const [recipient, setRecipient] = useState(""); // email or userId
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    try {
      if (!recipient.trim()) throw new Error("Please enter a recipient email.");
      if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount.");

      setLoading(true);

      const body: { amount: number; receiverEmail: string;} = {
        amount: Number(amount),
        receiverEmail: "", // bu daha sonra doldurulacak
      };
      console.log("Transfer request body:", body);
      body.receiverEmail = recipient.trim();
      
      await transfer(body);

      setSuccess("Transfer successful.");
      setAmount("");
      setRecipient("");

      // üst katmana haber ver + basit global event (layout dinleyebilir)
      onSuccess?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("wallet:changed"));
      }
    } catch (e: any) {
      setError(e.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Transfer</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Recipient email</label>
          <input
            value={recipient}
            onChange={(e)=>setRecipient(e.target.value)}
            placeholder="e.g. friend@example.com or 123"
            className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e)=>setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter amount"
            className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Send"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  );
}
