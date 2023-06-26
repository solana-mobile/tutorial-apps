import React, {useState, useCallback} from 'react';
import {Alert, Button} from 'react-native';
import {BasicCounter as BasicCounterProgram} from '../basic-counter/target/types/basic_counter';
import idl from '../basic-counter/target/idl/basic_counter.json';
import {AnchorProvider, Program} from '@coral-xyz/anchor';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {PublicKey, Transaction} from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

import {Account, useAuthorization} from './providers/AuthorizationProvider';
import {useConnection} from './providers/ConnectionProvider';
import {
  AuthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';

export const APP_IDENTITY = {
  name: 'Solana dApp Scaffold',
};

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

const LAMPORTS_PER_AIRDROP = 100000000;

type Props = Readonly<{
  counterPubkey: PublicKey | null;
}>;

export default function FetchCounterAccountButton({counterPubkey}: Props) {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {connection} = useConnection();
  const [signingInProgress, setSigningInProgress] = useState(false);

  const fetchCounterAccount = useCallback(async () => {
    if (!selectedAccount || !counterPubkey) {
      return null;
    }
    const anchorWallet = createAnchorWallet(selectedAccount, authorizeSession);
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'processed',
    });
    const counterProgramId = new PublicKey(
      '5tH6v5gyhxnEjyVDQFjuPrH9SzJ3Rvj1Q4zKphnZsN74',
    );
    const basicCounterProgram = new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      provider,
    );

    const counterAccount = await basicCounterProgram.account.counter.fetch(
      counterPubkey,
    );

    console.log('fetched counterAccount:');
    console.log(counterAccount);
  }, [authorizeSession, connection, counterPubkey, selectedAccount]);

  return (
    <Button
      title="Fetch Counter Account"
      disabled={signingInProgress}
      onPress={async () => {
        if (signingInProgress) {
          return;
        }
        setSigningInProgress(true);
        try {
          const signature = await fetchCounterAccount();
          console.log(signature);
          setTimeout(async () => {
            Alert.alert(
              'Transaction signed!',
              'View SignTransactionButton.tsx for implementation.',
              [{text: 'Ok', style: 'cancel'}],
            );
          }, 100);
        } finally {
          setSigningInProgress(false);
        }
      }}
    />
  );
}
