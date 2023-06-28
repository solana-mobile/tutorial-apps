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
import InitializeCounterButton from '../components/InitializeCounterButton';

export default function MainScreen() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [counterPubkey, setCounterPubkey] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      console.log('Fetching balance for: ' + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      console.log('Balance fetched: ' + fetchedBalance);
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

  const fetchCounterAccount = useCallback(async () => {
    const counterSeed = anchor.utils.bytes.utf8.encode('counter');

    const counterProgramId = new PublicKey(
      '5tH6v5gyhxnEjyVDQFjuPrH9SzJ3Rvj1Q4zKphnZsN74',
    );

    const [counterPubkey] = anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      counterProgramId,
    );
    console.log('Counter fetch');
    console.log(counterPubkey);
    setCounterPubkey(counterPubkey);
  }, []);

  useEffect(() => {
    fetchCounterAccount();
  }, [fetchCounterAccount]);

  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="1. Initialize Counter">
                <InitializeCounterButton counterPubkey={counterPubkey} />
              </Section>

              <Section title="2. Fetch Counter Account">
                <FetchCounterAccountButton counterPubkey={counterPubkey} />
              </Section>

              <Section title="3. Increment Counter">
                <IncrementCounterButton counterPubkey={counterPubkey} />
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
    flexDirection: 'column',
    paddingVertical: 4,
  },
});
