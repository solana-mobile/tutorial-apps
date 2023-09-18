import {StyleSheet, Text, View} from 'react-native';

export default function OnboardingIntro() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome!</Text>
      <View style={styles.paragraph}>
        <Text>
          This is an on-chain clicker game built on Solana, created for
          educational purposes. {'\n'}
        </Text>
        <Text>
          The source code for the Expo app and the on-chain program is fully
          open source. {'\n'}
        </Text>
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
