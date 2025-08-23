import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/fetcher";

export type Direction = "incoming" | "outgoing" | "all";
export type MRStatus = "PENDING" | "PAID" | "REJECTED" | "CANCELED" | "all";
export type Range = "10" | "1m" | "3m"; // FE convenience

function buildParams(direction: Direction, status: MRStatus, range: Range) {
  const qs = new URLSearchParams();
  qs.set("direction", direction);
  if (status && status !== "all") qs.set("status", status);
  if (range === "10") qs.set("limit", "10");
  if (range === "1m") qs.set("months", "1");
  if (range === "3m") qs.set("months", "3");
  return qs.toString();
}

export function makeMRKey(direction: Direction, status: MRStatus, range: Range) {
  const base = `${process.env.NEXT_PUBLIC_API_BASE_URL}/money-requests`;
  const qs = buildParams(direction, status, range);
  return `${base}?${qs}`;
}

export function useMoneyRequests(direction: Direction, status: MRStatus, range: Range) {
  const key = makeMRKey(direction, status, range);
  const { data, error, isLoading } = useSWR(key, swrFetcher);

  return {
    items: (data ?? []) as any[],
    error,
    isLoading,
    key,
    refresh: () => mutate(key),
  };
}
