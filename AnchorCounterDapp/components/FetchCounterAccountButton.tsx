import React, {useState, useCallback} from 'react';
import {Alert, Button} from 'react-native';
import {useCounterProgram} from './providers/CounterProgramProvider';

export default function FetchCounterAccountButton() {
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const {counterProgram, counterAccountPubkey} = useCounterProgram();

  const fetchCounterAccount = useCallback(async () => {
    if (!counterProgram) {
      console.warn(
        'CounterProgram is not initialized yet. Try connecting a wallet first.',
      );
      return;
    }
    const counterAccount = await counterProgram.account.counter.fetch(
      counterAccountPubkey,
    );

    console.log('fetched counterAccount:');
    console.log(counterAccount);
    return counterAccount;
  }, [counterProgram, counterAccountPubkey]);

  return (
    <Button
      title="Fetch Counter Account"
      disabled={fetchingInProgress}
      onPress={async () => {
        if (fetchingInProgress) {
          return;
        }
        setFetchingInProgress(true);
        try {
          const counterAccount = await fetchCounterAccount();
          console.log(counterAccount);
          setTimeout(async () => {
            Alert.alert(
              'Counter Account fetched!',
              `Current Count: ${counterAccount?.count}`,
              [{text: 'Ok', style: 'cancel'}],
            );
          }, 100);
        } finally {
          setFetchingInProgress(false);
        }
      }}
    />
  );
}
