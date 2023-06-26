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

type Props = Readonly<{
  counterPubkey: PublicKey | null;
}>;

export default function IncrementCounterButton({counterPubkey}: Props) {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {connection} = useConnection();
  const [signingInProgress, setSigningInProgress] = useState(false);

  const incrementCounter = useCallback(async () => {
    if (!selectedAccount || !counterPubkey) {
      return null;
    }
    console.log('debug: Before Create Wallet');
    const anchorWallet = createAnchorWallet(selectedAccount, authorizeSession);

    console.log('debug: Before Anchor Provider');
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'processed',
    });
    console.log('debug: After Anchor Provider');

    const counterProgramId = new PublicKey(
      '5tH6v5gyhxnEjyVDQFjuPrH9SzJ3Rvj1Q4zKphnZsN74',
    );
    console.log('debug: Before Program');
    const basicCounterProgram = new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      provider,
    );
    console.log('debug: After Program');

    console.log('debug: Before rpc');
    const signature = await basicCounterProgram.methods
      .increment()
      .accounts({
        counter: counterPubkey,
        authority: provider.wallet.publicKey,
      })
      .rpc();
    console.log('debug: After rpc');
    return signature;
  }, [authorizeSession, connection, counterPubkey, selectedAccount]);

  return (
    <Button
      title="Increment Counter"
      disabled={signingInProgress}
      onPress={async () => {
        if (signingInProgress) {
          return;
        }
        setSigningInProgress(true);
        try {
          const signature = await incrementCounter();
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
