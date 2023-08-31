import {clusterApiUrl, Connection} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Button, StyleSheet, View} from 'react-native';

import {useAuthorization} from '../hooks/AuthorizationProvider';
import {useAppState} from '../store/useAppState';
export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function ConnectScreen() {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {onConnect, gameState} = useAppState();

  useEffect(() => {
    if (selectedAccount) {
      onConnect(
        selectedAccount.publicKey,
        new Connection(clusterApiUrl('devnet')),
      );
      router.replace('Game/FarmScreen');
    }
  }, [onConnect, selectedAccount]);

  return (
    <View style={styles.container}>
      {selectedAccount ? (
        <Button
          onPress={() => {
            router.replace('Game/FarmScreen');
          }}
          title="Play"
        />
      ) : (
        <Button
          onPress={async () => {
            await transact(async wallet => {
              await authorizeSession(wallet);
            });
          }}
          title="Connect"
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
