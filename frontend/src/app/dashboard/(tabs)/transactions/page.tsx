"use client";

import { useState } from "react";
import TransactionList from "@/components/dashboard/TransactionList";

export default function TransactionsPage() {
  const [refreshKey] = useState(0); // ileride Top-Up/Transfer tetikleyebilir
  return <TransactionList refreshKey={refreshKey} />;
}
