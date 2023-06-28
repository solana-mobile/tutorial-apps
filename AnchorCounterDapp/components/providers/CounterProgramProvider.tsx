import {
  Account,
  Connection,
  Transaction,
  type ConnectionConfig,
} from '@solana/web3.js';
import React, {
  type FC,
  type ReactNode,
  useMemo,
  createContext,
  useContext,
} from 'react';
import * as anchor from '@coral-xyz/anchor';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  AuthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {useAuthorization} from './AuthorizationProvider';

export const RPC_ENDPOINT = 'devnet';

export interface CounterProgramProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

export const CounterProgramProvider: FC<CounterProgramProviderProps> = ({
  children,
  endpoint,
  config = {commitment: 'confirmed'},
}) => {
  const {authorizeSession} = useAuthorization();
  const connection = useMemo(
    () => new Connection(endpoint, config),
    [endpoint, config],
  );

  const anchorWallet = useMemo(() => {
    return {
      signTransaction: async (transaction: Transaction) => {
        return transact(async (wallet: Web3MobileWallet) => {
          const authorizedAccount = await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });
          return signedTransactions[0];
        });
      },
      signAllTransactions: async (transactions: Transaction[]) => {
        return transact(async (wallet: Web3MobileWallet) => {
          const authorizedAccount = await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: transactions,
          });
          return signedTransactions;
        });
      },
      get publicKey() {
        return selectedAccount.publicKey;
      },
    } as anchor.Wallet;
  }, []);

  const createAnchorWallet = (
    selectedAccount: Account,
    authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<
      Readonly<{
        address: string;
        label?: string | undefined;
        publicKey: anchor.web3.PublicKey;
      }>
    >,
  ) => {
    return {
      signTransaction: async (transaction: Transaction) => {
        return transact(async (wallet: Web3MobileWallet) => {
          const authorizedAccount = await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });
          return signedTransactions[0];
        });
      },
      signAllTransactions: async (transactions: Transaction[]) => {
        return transact(async (wallet: Web3MobileWallet) => {
          const authorizedAccount = await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: transactions,
          });
          return signedTransactions;
        });
      },
      get publicKey() {
        return selectedAccount.publicKey;
      },
    } as anchor.Wallet;
  };

  return (
    <ConnectionContext.Provider value={{connection}}>
      {children}
    </ConnectionContext.Provider>
  );
};

export interface ConnectionContextState {
  connection: Connection;
}

export const ConnectionContext = createContext<ConnectionContextState>(
  {} as ConnectionContextState,
);

export function useConnection(): ConnectionContextState {
  return useContext(ConnectionContext);
}
