import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Account, useAuthorization } from "./useAuthorization";
import {
  PublicKey,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export function useMobileWallet() {
  const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSession } =
    useAuthorization();

  const connect = useCallback(async (): Promise<Account> => {
    return await transact(async (wallet: Web3MobileWallet) => {
      return await authorizeSession(wallet);
    });
  }, [authorizeSession]);

  const signIn = useCallback(async (): Promise<Account> => {
    return await transact(async (wallet: Web3MobileWallet) => {
      return await authorizeSessionWithSignIn(wallet);
    });
  }, [authorizeSession]);

  const disconnect = useCallback(async (): Promise<void> => {
    await transact(async (wallet: Web3MobileWallet) => {
      await deauthorizeSession(wallet);
    });
  }, [deauthorizeSession]);

  const signAndSendTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction
    ): Promise<TransactionSignature> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        await authorizeSession(wallet);
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });
        return signatures[0];
      });
    },
    [authorizeSession]
  );

  const signTransactions = useCallback(
    async <T extends Transaction | VersionedTransaction>(
      transactions: T[]
    ): Promise<T[]> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        await authorizeSession(wallet);
        const signedTransactions = await wallet.signTransactions({
          transactions,
        });
        return signedTransactions;
      });
    },
    [authorizeSession]
  );

  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const authResult = await authorizeSession(wallet);
        const signedMessages = await wallet.signMessages({
          addresses: [authResult.address],
          payloads: [message],
        });
        return signedMessages[0];
      });
    },
    [authorizeSession]
  );

  const connectAnd = useCallback(
    async <T,>(
      cb: (wallet: Web3MobileWallet, authorizedAccount: Account) => Promise<T>
    ): Promise<T> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const authResult = await authorizeSession(wallet);
        return await cb(wallet, authResult);
      });
    },
    [authorizeSession]
  );

  return useMemo(
    () => ({
      connect,
      connectAnd,
      signIn,
      disconnect,
      signAndSendTransaction,
      signMessage,
      signTransactions,
    }),
    [signAndSendTransaction, signMessage, signTransactions]
  );
}
