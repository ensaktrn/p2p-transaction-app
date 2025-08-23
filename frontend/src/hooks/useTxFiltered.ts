import useSWR from "swr";
import { swrFetcher } from "@/lib/fetcher";

export function txKey(params: { limit?: number; months?: 1 | 3; type?: "all"|"topup"|"sent"|"received" }) {
  const base = `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`;
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.months) qs.set("months", String(params.months));
  if (params.type) qs.set("type", params.type!);
  const q = qs.toString();
  return q ? `${base}?${q}` : base;
}

export function useTxFiltered(params: { limit?: number; months?: 1|3; type?: "all"|"topup"|"sent"|"received" }) {
  const key = txKey(params);
  const { data, error, isLoading } = useSWR(key, swrFetcher);
  return { items: (data ?? []) as any[], error, isLoading };
}
