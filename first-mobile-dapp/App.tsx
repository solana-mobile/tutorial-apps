import {Cluster} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {ConnectionProvider} from '@solana/wallet-adapter-react';
import {clusterApiUrl} from '@solana/web3.js';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {AuthorizationProvider} from './components/AuthorizationProvider';
import {Header} from './components/Header';

import MainScreen from './screens/MainScreen';

export const APP_CLUSTER = 'testnet';

export default function App() {
  return (
    <ConnectionProvider
      config={{commitment: 'processed'}}
      endpoint={clusterApiUrl(APP_CLUSTER)}>
      <AuthorizationProvider>
        <SafeAreaView style={styles.shell}>
          <Header />
          <MainScreen />
        </SafeAreaView>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: '100%',
  },
});
