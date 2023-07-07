import {Program} from '@coral-xyz/anchor';
import {
  AuthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {Connection, PublicKey} from '@solana/web3.js';
import React, {useState, useCallback} from 'react';
import {Button} from 'react-native';

import {BasicCounter} from '../basic-counter/target/types/basic_counter';
import {useAnchorWallet} from './hooks/useAnchorWallet';
import {useCounterProgram} from './hooks/useCounterProgram';

import {Account} from './providers/AuthorizationProvider';
import {CounterAccount} from './providers/CounterProgramProvider';

type IncrementCounterButtonProps = Readonly<{
  onComplete: (counterAccount: CounterAccount) => void;
  connection: Connection;
  authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<
    Readonly<{
      address: string;
      label?: string | undefined;
      publicKey: PublicKey;
    }>
  >;
  selectedAccount: Account;
}>;

export default function IncrementCounterButton({
  onComplete,
  connection,
  authorizeSession,
  selectedAccount,
}: IncrementCounterButtonProps) {
  const [signingInProgress, setSigningInProgress] = useState(false);
  const anchorWallet = useAnchorWallet(authorizeSession, selectedAccount);
  const {counterProgram, counterAccountPubkey} = useCounterProgram(
    connection,
    anchorWallet,
  );

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
