import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {
  useAuthorization,
  Account,
} from '../components/providers/AuthorizationProvider';
import {useConnection} from '../components/providers/ConnectionProvider';

import IncrementCounterButton from '../components/IncrementCounterButton';
import CounterInfo from '../components/CounterInfo';
import {
  CounterAccount,
  useCounterProgram,
} from '../components/providers/CounterProgramProvider';
import SignIncrementTxButton from '../components/SignIncrementTxButton';
import {BasicCounter} from '../basic-counter/target/types/basic_counter';
import {Program} from '@coral-xyz/anchor';

export default function MainScreen() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const {counterProgram, counterAccountPubkey} = useCounterProgram();
  const [balance, setBalance] = useState<number | null>(null);
  const [counterValue, setCounterValue] = useState<string | null>(null);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      const fetchedBalance = await connection.getBalance(account.publicKey);
      setBalance(fetchedBalance);
    },
    [connection],
  );

  const fetchAndUpdateCounter = useCallback(
    async (program: Program<BasicCounter>) => {
      const counterAccount: CounterAccount =
        await program.account.counter.fetch(counterAccountPubkey);
      setCounterValue(counterAccount.count.toString());
    },
    [counterAccountPubkey],
  );

  // Auto fetch balance on connect
  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  // Auto fetch count
  useEffect(() => {
    if (!counterProgram) {
      return;
    }
    fetchAndUpdateCounter(counterProgram);
  }, [fetchAndUpdateCounter, counterProgram]);

  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Section title="Counter Program Info">
            <CounterInfo />
          </Section>
          {selectedAccount ? (
            <>
              <Section title="Increment the counter!">
                <Text style={styles.counter}>
                  Count: <Text>{counterValue ?? '...'}</Text>
                </Text>
                <View style={styles.buttonGroup}>
                  <IncrementCounterButton
                    onComplete={(counterAccount: CounterAccount) => {
                      setCounterValue(counterAccount.count.toString());
                    }}
                  />
                  <SignIncrementTxButton />
                </View>
              </Section>
            </>
          ) : null}
        </ScrollView>
        {selectedAccount ? (
          <AccountInfo
            selectedAccount={selectedAccount}
            balance={balance}
            fetchAndUpdateBalance={fetchAndUpdateBalance}
          />
        ) : (
          <ConnectButton title="Connect wallet" />
        )}
        <Text>Selected cluster: {connection.rpcEndpoint}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 16,
    flex: 1,
  },
  scrollContainer: {
    height: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 4,
  },
  counter: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});
