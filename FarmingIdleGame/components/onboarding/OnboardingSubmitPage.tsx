import {StyleSheet, Text, View} from 'react-native';

export default function OnboardingGamePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>How to play!</Text>
      <Text style={styles.paragraph}>
        <Text>
          This goal of the game is to harvest crops, upgrade your farm, and
          'cash out' your game progress for a finalized NFT of your score!{' '}
          {'\n'}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
    textAlign: 'center',
  },
});
