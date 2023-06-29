import React, {useState, useCallback} from 'react';
import {Alert, Button} from 'react-native';

import {useAuthorization} from './providers/AuthorizationProvider';
import {useCounterProgram} from './providers/CounterProgramProvider';

export default function IncrementCounterButton() {
  const {selectedAccount} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  const incrementCounter = useCallback(async () => {
    if (!counterProgram) {
      console.warn(
        'CounterProgram is not initialized yet. Try connecting a wallet first.',
      );
      return;
    }
    const signature = await counterProgram.methods
      .increment()
      .accounts({
        counter: counterAccountPubkey,
        authority: selectedAccount?.publicKey,
      })
      .rpc();
    return signature;
  }, [counterProgram, counterAccountPubkey, selectedAccount?.publicKey]);

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
              'Counter increment successful!',
              'Fetch the counter account to see the updated value.',
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
