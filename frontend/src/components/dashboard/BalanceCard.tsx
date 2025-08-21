"use client";

import { formatTRY } from "@/lib/format";

type Props = {
  balance: number;
};

export default function BalanceCard({ balance }: Props) {
  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Bakiyen</h2>
      <p className="text-2xl font-bold">{formatTRY(balance)}</p>
      {/* İleri adım: burada Topup/Transfer butonları göstereceğiz */}
    </div>
  );
}
