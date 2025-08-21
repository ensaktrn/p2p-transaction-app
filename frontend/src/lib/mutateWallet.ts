import { mutate } from "swr";
import { userKey } from "@/hooks/useUser";
import { TX_KEY } from "@/hooks/useTransactions";

/**
 * delta: bakiyeye anında yansıtmak istersen (+/-)
 * Örn: Topup -> +amount, Transfer -> -amount
 */
export function mutateWallet(delta?: number) {
  const uKey = userKey();
  if (uKey) {
    if (typeof delta === "number") {
      mutate(
        uKey,
        (prev: any) => (prev ? { ...prev, balance: Number(prev.balance ?? 0) + delta } : prev),
        { revalidate: true }
      );
    } else {
      mutate(uKey); // sadece revalidate
    }
  }
  mutate(TX_KEY);
}
