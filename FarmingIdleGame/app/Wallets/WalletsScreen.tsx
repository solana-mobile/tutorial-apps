import {router} from 'expo-router';
import {Button, StyleSheet, Text, View} from 'react-native';

export default function WalletsScreen() {
  return (
    <View style={styles.container}>
      <Text>Wallets</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
