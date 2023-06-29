import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import * as anchor from '@coral-xyz/anchor';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {
  useAuthorization,
  Account,
} from '../components/providers/AuthorizationProvider';
import {useConnection} from '../components/providers/ConnectionProvider';

import IncrementCounterButton from '../components/IncrementCounterButton';
import {PublicKey} from '@solana/web3.js';
import FetchCounterAccountButton from '../components/FetchCounterAccountButton';
import CounterInfo from '../components/CounterInfo';
import {
  CounterAccount,
  useCounterProgram,
} from '../components/providers/CounterProgramProvider';

export default function MainScreen() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);
  const [counterValue, setCounterValue] = useState<string | null>(null);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      const fetchedBalance = await connection.getBalance(account.publicKey);
      setBalance(fetchedBalance);
    },
    [connection],
  );

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="Counter Program Info">
                <CounterInfo counterValue={counterValue} />
              </Section>

              <Section title="Increment the counter!">
                <View style={styles.buttonGroup}>
                  <IncrementCounterButton />
                  <FetchCounterAccountButton
                    onFetchComplete={(counterAccount: CounterAccount) => {
                      setCounterValue(counterAccount.count.toString());
                    }}
                  />
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
  },
});
