import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/fetcher";
export const FRIENDS_KEY = `${process.env.NEXT_PUBLIC_API_BASE_URL}/friends`;

export function useFriends() {
  const { data, error, isLoading } = useSWR(FRIENDS_KEY, swrFetcher);
  return {
    friends: (data ?? []) as any[],
    isLoading,
    error,
    refresh: () => mutate(FRIENDS_KEY),
    mutateLocal: (fn: (prev: any[]) => any[]) => mutate(FRIENDS_KEY, (p: any[] = []) => fn(p), { revalidate: false }),
  };
}
