import React from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {useAuthorization} from './providers/AuthorizationProvider';
import {useConnection, RPC_ENDPOINT} from './providers/ConnectionProvider';
import useMetaplex from '../metaplex-util/useMetaplex';

export default function MintButton() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    RPC_ENDPOINT,
  );

  console.log(metaplex);

  return (
    <View style={styles.container}>
      <Button title="Mint NFT" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
