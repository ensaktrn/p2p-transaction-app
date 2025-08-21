import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/fetcher";

export function userKey() {
  if (typeof window === "undefined") return null;
  const userId = localStorage.getItem("userId");
  if (!userId) return null;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`;
}

export function useUser() {
  const key = userKey();
  const { data, error, isLoading } = useSWR(key, swrFetcher);
  return {
    user: data as { id: number; email: string; name?: string | null; balance: number } | undefined,
    isLoading,
    error,
    refresh: () => key && mutate(key),
  };
}
