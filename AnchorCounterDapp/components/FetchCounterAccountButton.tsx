import React, {useState, useCallback} from 'react';
import {Alert, Button} from 'react-native';
import {
  CounterAccount,
  useCounterProgram,
} from './providers/CounterProgramProvider';

type FetchCounterAccountButtonProps = Readonly<{
  onFetchComplete: (counterAccount: CounterAccount) => void;
}>;

export default function FetchCounterAccountButton({
  onFetchComplete,
}: FetchCounterAccountButtonProps) {
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  return (
    <Button
      title="Update Count"
      disabled={fetchingInProgress}
      onPress={async () => {
        if (fetchingInProgress) {
          return;
        }
        setFetchingInProgress(true);
        try {
          if (!counterProgram) {
            console.warn(
              'CounterProgram is not initialized yet. Try connecting a wallet first.',
            );
            return;
          }
          const counterAccount: CounterAccount =
            await await counterProgram.account.counter.fetch(
              counterAccountPubkey,
            );
          onFetchComplete(counterAccount);
          Alert.alert(
            'Counter Account updated!',
            `Current Count: ${counterAccount?.count}`,
            [{text: 'Ok', style: 'cancel'}],
          );
        } finally {
          setFetchingInProgress(false);
        }
      }}
    />
  );
}
