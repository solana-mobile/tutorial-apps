import {PublicKey, Transaction} from '@solana/web3.js';
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
import {AnchorProvider, Program} from '@coral-xyz/anchor';

import {useAuthorization} from './AuthorizationProvider';
import {BasicCounter as BasicCounterProgram} from '../../basic-counter/target/types/basic_counter';
import idl from '../../basic-counter/target/idl/basic_counter.json';
import {useConnection} from './ConnectionProvider';

export const RPC_ENDPOINT = 'devnet';

export interface CounterProgramProviderProps {
  children: ReactNode;
}

export const CounterProgramProvider: FC<CounterProgramProviderProps> = ({
  children,
}) => {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {connection} = useConnection();

  const anchorWallet = useMemo(() => {
    if (!authorizeSession || !selectedAccount) {
      return null;
    }

    return {
      signTransaction: async (transaction: Transaction) => {
        return transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });
          return signedTransactions[0];
        });
      },
      signAllTransactions: async (transactions: Transaction[]) => {
        return transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);
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
  }, [authorizeSession, selectedAccount]);

  const counterProgramId = useMemo(() => {
    return new PublicKey('5tH6v5gyhxnEjyVDQFjuPrH9SzJ3Rvj1Q4zKphnZsN74');
  }, []);

  const [counterAccountPubkey] = useMemo(() => {
    const counterSeed = anchor.utils.bytes.utf8.encode('counter');
    return anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      counterProgramId,
    );
  }, [counterProgramId]);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return null;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'processed',
    });
  }, [anchorWallet, connection]);

  const basicCounterProgram = useMemo(() => {
    if (!provider) {
      return null;
    }

    return new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      provider,
    );
  }, [counterProgramId, provider]);

  const value = useMemo(
    () => ({
      counterProgram: basicCounterProgram,
      counterProgramId: counterProgramId,
      counterAccountPubkey: counterAccountPubkey,
    }),
    [basicCounterProgram, counterProgramId, counterAccountPubkey],
  );

  return (
    <CounterProgramContext.Provider value={value}>
      {children}
    </CounterProgramContext.Provider>
  );
};

export interface CounterProgramContextState {
  counterProgram: Program<BasicCounterProgram> | null;
  counterProgramId: PublicKey;
  counterAccountPubkey: PublicKey;
}

export const CounterProgramContext = createContext<CounterProgramContextState>(
  {} as CounterProgramContextState,
);

export function useCounterProgram(): CounterProgramContextState {
  return useContext(CounterProgramContext);
}
