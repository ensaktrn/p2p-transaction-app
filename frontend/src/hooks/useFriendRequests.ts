import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/fetcher";

export const REQ_INCOMING = `${process.env.NEXT_PUBLIC_API_BASE_URL}/friends/requests?direction=incoming`;
export const REQ_OUTGOING = `${process.env.NEXT_PUBLIC_API_BASE_URL}/friends/requests?direction=outgoing`;

export function useFriendRequests() {
  const inc = useSWR(REQ_INCOMING, swrFetcher);
  const out = useSWR(REQ_OUTGOING, swrFetcher);

  return {
    incoming: (inc.data ?? []) as any[],
    outgoing: (out.data ?? []) as any[],
    loading: inc.isLoading || out.isLoading,
    error: inc.error || out.error,
    refreshAll: () => { mutate(REQ_INCOMING); mutate(REQ_OUTGOING); },
    mutateIncoming: (fn:(prev:any[])=>any[]) => mutate(REQ_INCOMING, (p:any[]=[])=>fn(p), { revalidate:false }),
    mutateOutgoing: (fn:(prev:any[])=>any[]) => mutate(REQ_OUTGOING, (p:any[]=[])=>fn(p), { revalidate:false }),
  };
}
