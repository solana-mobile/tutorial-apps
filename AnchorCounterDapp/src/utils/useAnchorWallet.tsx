import {
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMemo } from "react";
import { useMobileWallet } from "./useMobileWallet";
import { useAuthorization } from "./useAuthorization";

export interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>;
}

export function useAnchorWallet(): AnchorWallet | undefined {
  const { selectedAccount } = useAuthorization();
  const mobileWallet = useMobileWallet();
  return useMemo(() => {
    if (!selectedAccount) {
      return;
    }

    return {
      signTransaction: async <T extends Transaction | VersionedTransaction>(
        transaction: T
      ) => {
        const signedTransactions = await mobileWallet.signTransactions([
          transaction,
        ]);
        return signedTransactions[0];
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(
        transactions: T[]
      ) => {
        return await mobileWallet.signTransactions(transactions);
      },
      get publicKey() {
        return selectedAccount.publicKey;
      },
    };
  }, [mobileWallet, selectedAccount]);
}
