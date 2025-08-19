"use client";

import { useState } from "react";
import AddCardForm from "@/components/forms/AddCardForm";
import TopupForm from "@/components/forms/TopUpForm";

export default function TopupPage() {
  const [txRefreshKey, setTxRefreshKey] = useState(0);

  const handleSuccess = () => {
    // burada istersen global bir data katmanıyla balance/tx güncelle
    setTxRefreshKey(k => k + 1);
  };

  return (
    <>
      <AddCardForm onSuccess={() => { /* optional: kart listesi sayfasında refresh */ }} />
      <TopupForm onSuccess={handleSuccess} />
    </>
  );
}
