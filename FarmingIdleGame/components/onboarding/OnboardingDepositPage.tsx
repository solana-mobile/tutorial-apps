import {StyleSheet, Text, View} from 'react-native';

export default function OnboardingDepositPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step One: Initialize</Text>
      <Text>
        To initialize your farm, deposit{' '}
        <Text style={styles.boldedText}>0.001 SOL</Text> to a burner wallet,
        stored locally on your device.{'\n'}
      </Text>
      <Text>
        The burner wallet is stored locally on your device and used for paying
        game action fees.
        {'\n'}
      </Text>
      <Text>
        A burner enables a seamless signing experience without authorization
        prompts.
        {'\n'}
      </Text>
      <Text style={styles.boldedText}>
        **The burner wallet is unsafe and uninstalling the app causes access to
        the wallet!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
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
});
