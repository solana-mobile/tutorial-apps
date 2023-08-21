import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {Account, useAuthorization} from '../storage/AuthorizationProvider';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function ConnectScreen() {
  const {authorizeSession, selectedAccount} = useAuthorization();

  useEffect(() => {
    if (selectedAccount) {
      router.replace('Game/HarvestScreen');
    }
  }, [selectedAccount]);

  return (
    <View style={styles.container}>
      {selectedAccount ? (
        <Button
          onPress={() => {
            router.replace('Game/HarvestScreen');
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
