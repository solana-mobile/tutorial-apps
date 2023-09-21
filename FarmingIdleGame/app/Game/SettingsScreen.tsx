import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

import BalanceHeaderBar from '../../components/BalanceHeaderBar';
import GameButton from '../../components/GameButton';
import InfoCard from '../../components/InfoCard';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';

export default function SettingsScreen() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const [isLoading, setIsLoading] = useState(false);

  const {
    owner,
    playerKeypair,
    withdrawPlayerBalance,
    resetPlayer,
    playerBalance,
    ownerBalance,
  } = useAppState();

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/crystal_background.jpg')}>
      <BalanceHeaderBar />
      <View style={styles.container}>
        <InfoCard
          title="Wallet Management"
          subtitle={'Manage your connected wallets.'}
          onPress={() => {
            router.push('/Wallets');
          }}
        />

        <InfoCard
          title="Leaderboards"
          subtitle={'View the global Top 5 farms.'}
          onPress={() => {
            router.push('/Leaderboard');
          }}
        />
        <InfoCard
          title="Submit highscore"
          subtitle={'Finish the game by recording your score.'}
          onPress={() => {
            router.push('/Leaderboard');
          }}
        />
        <InfoCard
          title="Dev Resources"
          subtitle={'Learn about how this app is built.'}
          onPress={() => {
            router.push('/Leaderboard');
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainButtonSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
