import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/fetcher";

export const TX_KEY = `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`;

export function useTransactions() {
  const { data, error, isLoading } = useSWR(TX_KEY, swrFetcher);
  return {
    txs: (data ?? []) as any[],
    isLoading,
    error,
    refresh: () => mutate(TX_KEY),
  };
}
