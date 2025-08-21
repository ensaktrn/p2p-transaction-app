"use client";

import { useState } from "react";
import { addCard } from "@/services/cards";

type Props = { onSuccess?: () => void };

export default function AddCardForm({ onSuccess }: { onSuccess?: () => void }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState<number | "">("");
  const [expYear, setExpYear] = useState<number | "">("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const onlyDigits = (s:string) => s.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      setLoading(true);
      if (!expMonth || !expYear) throw new Error("Expiration date is required.");
      if (cardNumber.length !== 16) throw new Error("Card number must be 16 digits.");
      if (cvv.length !== 3) throw new Error("CVV must be 3 digits.");
      if (expMonth < 1 || expMonth > 12) throw new Error("Invalid month.");
      await addCard({
        cardNumber: cardNumber.replace(/\s+/g, ""),
        cvv,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        nameOnCard,
      });
      setSuccess("Card successfully added to your account.");
      setCardNumber(""); setCvv(""); setExpMonth(""); setExpYear(""); setNameOnCard("");
      onSuccess?.();
    } catch (e:any) {
      setError(e.message || "Failed to add card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Add a Card</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <input
          value={nameOnCard}
          onChange={(e)=>setNameOnCard(e.target.value)}
          placeholder="Name on card"
          className="border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          value={cardNumber}
          onChange={(e)=>setCardNumber(onlyDigits(e.target.value).slice(0,16))}
          placeholder="Card number (no spaces)"
          inputMode="numeric"
          className="border border-gray-300 rounded-lg p-2"
          required
        />
        <div className="flex gap-2">
          <input
            value={cvv}
            onChange={(e)=>setCvv(onlyDigits(e.target.value).slice(0,3))}
            placeholder="CVV"
            inputMode="numeric"
            className="border border-gray-300 rounded-lg p-2 w-24"
            required
          />
          <input
            type="number"
            value={expMonth}
            onChange={(e)=>setExpMonth(e.target.value ? Number(e.target.value) : "")}
            placeholder="MM"
            min={1} max={12}
            className="border border-gray-300 rounded-lg p-2 w-24"
            required
          />
          <input
            type="number"
            value={expYear}
            onChange={(e)=>setExpYear(e.target.value ? Number(e.target.value) : "")}
            placeholder="YYYY"
            min={2024}
            className="border border-gray-300 rounded-lg p-2 w-28"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Card"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  );
}
