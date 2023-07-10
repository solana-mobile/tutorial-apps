import {Program} from '@coral-xyz/anchor';
import {PublicKey} from '@solana/web3.js';
import React, {useState, useCallback} from 'react';
import {Button} from 'react-native';
import * as anchor from '@coral-xyz/anchor';

import {BasicCounter} from '../basic-counter/target/types/basic_counter';

import {useConnection} from './providers/ConnectionProvider';
import {useCounterProgram} from './hooks/useCounterProgram';
import {useAuthorization} from './providers/AuthorizationProvider';

type CounterAccount = {
  count: anchor.BN;
  authority: PublicKey;
  bump: number;
};

type IncrementCounterButtonProps = Readonly<{
  onComplete: (counterAccount: CounterAccount) => void;
  anchorWallet: anchor.Wallet;
}>;

export default function IncrementCounterButton({
  onComplete,
  anchorWallet,
}: IncrementCounterButtonProps) {
  const [signingInProgress, setSigningInProgress] = useState(false);
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const {counterProgram, counterPDA} = useCounterProgram(
    connection,
    anchorWallet,
  );

  const incrementCounter = useCallback(
    async (program: Program<BasicCounter>, authorityPublicKey: PublicKey) => {
      // Call the increment function of the program.
      const signature = await program.methods
        .increment()
        .accounts({
          counter: counterPDA,
          authority: authorityPublicKey,
        })
        .rpc();

      return signature;
    },
    [counterPDA],
  );

  return (
    <Button
      title="+1 Counter"
      disabled={signingInProgress || !counterProgram}
      onPress={async () => {
        if (signingInProgress || !counterProgram || !selectedAccount) {
          return;
        }
        setSigningInProgress(true);
        try {
          const signature = await incrementCounter(
            counterProgram,
            selectedAccount.publicKey,
          );

          // Fetch the account info for the Counter PDA to see the new count value.
          const counterAccount: CounterAccount =
            await counterProgram.account.counter.fetch(counterPDA);

          // Update the count value state.
          onComplete(counterAccount);
        } finally {
          setSigningInProgress(false);
        }
      }}
    />
  );
}
