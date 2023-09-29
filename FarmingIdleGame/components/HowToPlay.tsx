import {StyleSheet, Text} from 'react-native';

export default function HowToPlay() {
  return (
    <Text>
      <Text style={styles.boldedText}>How to play:{'\n'}</Text>
      <Text>
        1. Deposit <Text style={styles.boldedText}>0.01</Text> SOL to a
        <Text style={styles.boldedText}> temporary burner wallet</Text> to start
        the game.
      </Text>
      {'\n'}
      <Text>
        2. Collect harvest points (🌾) by clicking the harvest button.{'\n'}
      </Text>
      <Text>
        3. Each 'harvest' is an on-chain transaction signed/paid with the burner
        wallet!
      </Text>
      {'\n'}
      <Text>4. Upgrade your farm to increase your harvest yields.</Text>
      {'\n'}
      <Text>5. Trade your farm to receive an NFT of your game score.</Text>
      {'\n'}
      {'\n'}
      <Text style={styles.boldedText}>
        **The burner wallet is unsafe and stored locally on your device. If you
        uninstall the app, you will lose access to the burner wallet!
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  boldedText: {fontWeight: 'bold'},
});
