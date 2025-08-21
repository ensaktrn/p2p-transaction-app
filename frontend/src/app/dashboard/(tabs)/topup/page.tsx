"use client";

import { useState } from "react";
import AddCardForm from "@/components/forms/AddCardForm";
import TopupForm from "@/components/forms/TopUpForm";
import { mutate } from "swr";

export default function TopupPage() {
  const [txRefreshKey, setTxRefreshKey] = useState(0);

  const handleSuccess = () => {
    setTxRefreshKey(k => k + 1);
  };

  return (
    <>
      <AddCardForm onSuccess={() => { /* optional: kart listesi sayfasında refresh */ }} />
      <TopupForm onSuccess={handleSuccess} />
    </>
  );
}
