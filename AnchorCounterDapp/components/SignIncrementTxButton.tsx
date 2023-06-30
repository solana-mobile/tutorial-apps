import React, {useCallback, useState} from 'react';
import {Button} from 'react-native';
import {useAuthorization} from './providers/AuthorizationProvider';
import {useCounterProgram} from './providers/CounterProgramProvider';

import {alertAndLog} from '../util/alertAndLog';
import {Transaction} from '@solana/web3.js';
import {BasicCounter} from '../basic-counter/target/types/basic_counter';
import {Program} from '@coral-xyz/anchor';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useConnection} from './providers/ConnectionProvider';

export default function SignIncrementTxButton() {
  const {connection} = useConnection();
  const {selectedAccount, authorizeSession} = useAuthorization();
  const [genInProgress, setGenInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  const signIncrementTransaction = useCallback(
    async (program: Program<BasicCounter>) => {
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
            authority: selectedAccount?.publicKey,
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
    [
      authorizeSession,
      connection,
      counterAccountPubkey,
      selectedAccount?.publicKey,
    ],
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
          if (!counterProgram) {
            console.warn(
              'CounterProgram is not initialized yet. Try connecting a wallet first.',
            );
            return;
          }
          const incrementTransaction = await signIncrementTransaction(
            counterProgram,
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
