"use client";

import dynamic from "next/dynamic";

// ClientToaster'ı yalnızca client'ta render et (SSR kapalı)
const NoSSRToaster = dynamic(() => import("@/components/ClientToaster"), { ssr: false });

export default function ToasterNoSSR() {
  return <NoSSRToaster />;
}