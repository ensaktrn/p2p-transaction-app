"use client";

import { useEffect, useState } from "react";
import { fetchCards, type CardListItem } from "@/services/cards";
import { topup } from "@/services/wallet";
import { mutateWallet } from "@/lib/mutateWallet";
import { toast } from "sonner";

type Props = { onSuccess?: () => void };

export default function TopupForm({ onSuccess }: Props) {
  const [cards, setCards] = useState<CardListItem[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCards();
        setCards(data);
        if (data[0]) setSelectedCardId(data[0].id);
      } catch (e: any) {
        setError(e.message || "Failed to load cards.");
      } finally {
        setLoadingCards(false);
      }
    })();
  }, []);

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!selectedCardId) throw new Error("Please select a card.");
      if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount.");
      setLoading(true);
      const amt = Number(amount);
      await topup({ cardId: Number(selectedCardId), amount: amt });

      // ✅ SWR cache güncelle
      mutateWallet(+amt);
      onSuccess?.();
      setAmount("");
      toast.success("Top up successful");
    } catch (e: any) {
      setError(e.message || "Top up failed.");
      toast.error(e.message || "Top up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Top Up</h2>
      {loadingCards ? (
        <p>Loading cards...</p>
      ) : cards.length === 0 ? (
        <div className="text-sm text-gray-600">
          <p>No saved cards found.</p>
        </div>
      ) : (
        <form onSubmit={handleTopup} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Select card</label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-full mt-1"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.brand || "CARD")} •••• {c.last4} — {c.nameOnCard} (exp {c.expMonth}/{c.expYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
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
            {loading ? "Processing..." : "Top Up"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}
    </div>
  );
}
