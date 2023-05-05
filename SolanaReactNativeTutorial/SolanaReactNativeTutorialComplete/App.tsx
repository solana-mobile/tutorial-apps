import {StyleSheet} from 'react-native';
import {ConnectionProvider} from '@solana/wallet-adapter-react';
import {clusterApiUrl} from '@solana/web3.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';

import MainScreen from './screens/MainScreen';

const DEVNET_ENDPOINT = /*#__PURE__*/ clusterApiUrl('testnet');

export default function App() {
  return (
    <ConnectionProvider
      config={{commitment: 'processed'}}
      endpoint={DEVNET_ENDPOINT}>
      <SafeAreaView style={styles.container}>
        <MainScreen />
      </SafeAreaView>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
