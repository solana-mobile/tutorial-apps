import {router} from 'expo-router';
import {ImageBackground, StyleSheet, View} from 'react-native';

import BalanceHeaderBar from '../../components/BalanceHeaderBar';
import InfoCard from '../../components/InfoCard';

export default function SettingsScreen() {
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/crystal_background.jpg')}>
      <BalanceHeaderBar />
      <View style={styles.container}>
        <InfoCard
          title="⚙️ Wallet Management"
          subtitle={'Manage your connected wallets.'}
          onPress={() => {
            router.push('/Wallets');
          }}
        />

        <InfoCard
          title="🏆 Leaderboards"
          subtitle={'View the global Top 5 farms.'}
          onPress={() => {
            router.push('/Leaderboard');
          }}
        />
        <InfoCard
          title="✅ Submit highscore"
          subtitle={'Finish the game by recording your score.'}
          onPress={() => {
            router.push('/Leaderboard');
          }}
        />
        <InfoCard
          title="🎓 Dev Resources"
          subtitle={'Learn about how this app is built.'}
          onPress={() => {
            router.push('/DevResources');
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
