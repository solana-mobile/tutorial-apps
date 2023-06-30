import {Program} from '@coral-xyz/anchor';
import React, {useState, useCallback} from 'react';
import {Button} from 'react-native';
import {BasicCounter} from '../basic-counter/target/types/basic_counter';

import {useAuthorization} from './providers/AuthorizationProvider';
import {
  CounterAccount,
  useCounterProgram,
} from './providers/CounterProgramProvider';

type IncrementCounterButtonProps = Readonly<{
  onComplete: (counterAccount: CounterAccount) => void;
}>;

export default function IncrementCounterButton({
  onComplete,
}: IncrementCounterButtonProps) {
  const {selectedAccount} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  const incrementCounter = useCallback(
    async (program: Program<BasicCounter>) => {
      // Call the increment function of the program.
      const signature = await program.methods
        .increment()
        .accounts({
          counter: counterAccountPubkey,
          authority: selectedAccount?.publicKey,
        })
        .rpc();

      return signature;
    },
    [counterAccountPubkey, selectedAccount?.publicKey],
  );

  return (
    <Button
      title="+1 Counter"
      disabled={signingInProgress || !counterProgram}
      onPress={async () => {
        if (signingInProgress || !counterProgram) {
          return;
        }
        setSigningInProgress(true);
        try {
          const signature = await incrementCounter(counterProgram);

          // Fetch the account info for the Counter PDA to see the new count value.
          const counterAccount: CounterAccount =
            await counterProgram.account.counter.fetch(counterAccountPubkey);

          // Update the count value state.
          onComplete(counterAccount);
        } finally {
          setSigningInProgress(false);
        }
      }}
    />
  );
}
