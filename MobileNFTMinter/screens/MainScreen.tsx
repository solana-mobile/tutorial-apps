import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import ConnectButton from '../components/ConnectButton';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
import {useConnection} from '../components/providers/ConnectionProvider';
import DisconnectButton from '../components/DisconnectButton';
import NftMinter from '../components/NftMinter';

export default function MainScreen() {
  const {selectedAccount} = useAuthorization();
  const {connection} = useConnection();
  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <NftMinter />
            </>
          ) : null}
        </ScrollView>
        {selectedAccount ? (
          <DisconnectButton title="Disconnect" />
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
