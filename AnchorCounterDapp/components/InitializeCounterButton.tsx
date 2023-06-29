import React, {useState, useCallback} from 'react';
import {Alert, Button} from 'react-native';
import * as anchor from '@coral-xyz/anchor';

import {useAuthorization} from './providers/AuthorizationProvider';
import {useCounterProgram} from './providers/CounterProgramProvider';

export default function InitializeCounterButton() {
  const {selectedAccount} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  const initializeCounter = useCallback(async () => {
    if (!counterProgram) {
      console.warn(
        'CounterProgram is not initialized yet. Try connecting a wallet first.',
      );
      return;
    }
    const signature = await counterProgram.methods
      .initialize()
      .accounts({
        counter: counterAccountPubkey,
        authority: selectedAccount?.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    return signature;
  }, [counterProgram, counterAccountPubkey, selectedAccount?.publicKey]);

  return (
    <Button
      title="Initialize Counter"
      disabled={signingInProgress}
      onPress={async () => {
        if (signingInProgress) {
          return;
        }
        setSigningInProgress(true);
        try {
          const signature = await initializeCounter();
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
