import React, {useCallback, useState} from 'react';
import {Button} from 'react-native';

import {alertAndLog} from '../util/alertAndLog';
import {PublicKey, Transaction} from '@solana/web3.js';
import {BasicCounter} from '../basic-counter/target/types/basic_counter';
import {Program} from '@coral-xyz/anchor';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import * as anchor from '@coral-xyz/anchor';

import {useAuthorization} from './providers/AuthorizationProvider';
import {useCounterProgram} from './hooks/useCounterProgram';
import {useConnection} from './providers/ConnectionProvider';

type SignIncrementTxProps = Readonly<{
  anchorWallet: anchor.Wallet;
}>;

export default function IncrementCounterButton({
  anchorWallet,
}: SignIncrementTxProps) {
  const [genInProgress, setGenInProgress] = useState(false);
  const {connection} = useConnection();
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {counterProgram, counterAccountPubkey} = useCounterProgram(
    connection,
    anchorWallet,
  );

  const signIncrementTransaction = useCallback(
    async (program: Program<BasicCounter>, authoritiyPublicKey: PublicKey) => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const [authorizationResult, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);

        // Generate the increment ix from the Anchor program
        const incrementInstruction = await program.methods
          .increment()
          .accounts({
            counter: counterAccountPubkey,
            authority: authoritiyPublicKey,
          })
          .instruction();

        // Build a transaction containing the instruction
        const incrementTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(incrementInstruction);

        // Sign a transaction and receive
        const signedTransactions = await wallet.signTransactions({
          transactions: [incrementTransaction],
        });

        return signedTransactions[0];
      });
    },
    [authorizeSession, connection, counterAccountPubkey],
  );

  return (
    <Button
      title="Sign Increment Tx"
      disabled={genInProgress}
      onPress={async () => {
        if (genInProgress) {
          return;
        }
        setGenInProgress(true);
        try {
          if (!counterProgram || !selectedAccount) {
            console.warn(
              'Program/wallet is not initialized yet. Try connecting a wallet first.',
            );
            return;
          }
          const incrementTransaction = await signIncrementTransaction(
            counterProgram,
            selectedAccount.publicKey,
          );

          alertAndLog(
            'Increment Transaction: ',
            'See console for logged transaction.',
          );
          console.log(incrementTransaction);
        } finally {
          setGenInProgress(false);
        }
      }}
    />
  );
}
