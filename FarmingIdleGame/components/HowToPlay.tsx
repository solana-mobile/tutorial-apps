import {StyleSheet, Text} from 'react-native';

export default function HowToPlay() {
  return (
    <Text>
      <Text style={styles.boldedText}>How to play:{'\n'}</Text>
      <Text>
        1. Deposit <Text style={styles.boldedText}>0.001</Text> SOL to a
        temporary burner wallet<Text style={styles.boldedText}>**</Text>.
      </Text>
      {'\n'}
      <Text>2. Collect harvest points by clicking the harvest button</Text>
      {'\n'}
      <Text>3. Upgrade your farm to increase your harvest yields</Text>
      {'\n'}
      <Text>4. Trade your farm to receive an NFT of your game score.</Text>
      {'\n'}
      {'\n'}
      <Text style={styles.boldedText}>
        **The burner wallet is unsafe and stored locally on your device. If you
        uninstall the app, you will not have access to the burner wallet!
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  boldedText: {fontWeight: 'bold'},
});
