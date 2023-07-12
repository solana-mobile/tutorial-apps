import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import SignMessageButton from '../components/SignMessageButton';
import MintButton from '../components/MintButton';
import {useConnection} from '../components/providers/ConnectionProvider';

export default function MainScreen() {
  const {selectedAccount} = useAuthorization();
  const {connection} = useConnection();
  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="Mint an NFT">
                <MintButton />
              </Section>

              <Section title="Sign a message">
                <SignMessageButton />
              </Section>
            </>
          ) : null}
        </ScrollView>
        {selectedAccount ? (
          <AccountInfo selectedAccount={selectedAccount} />
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
