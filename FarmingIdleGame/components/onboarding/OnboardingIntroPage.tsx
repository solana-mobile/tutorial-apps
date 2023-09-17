import {StyleSheet, Text, View} from 'react-native';

export default function OnboardingIntroPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome!</Text>
      <View style={styles.paragraph}>
        <Text>
          This is an on-chain clicker game built on Solana, created educational
          purposes. {'\n'}
        </Text>
        <Text>
          This goal is to harvest crops, upgrade your farm, and 'cash out' your
          game progress for a finalized NFT of your score! {'\n'}
        </Text>
        <Text>
          The source code for both the Expo app and the on-chain program is
          fully open source. {'\n'}
        </Text>
        <Text>Click next to see how to play the game!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    paddingBottom: 12,
  },
  boldedText: {
    fontWeight: 'bold',
  },
  paragraph: {
    justifyContent: 'center',
  },
});
