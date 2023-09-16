import {StyleSheet, Text, View} from 'react-native';

export default function HowToCrops() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crop Upgrades</Text>
      <Text>- Upgrade your farm by purchasing new crops with 🌾. {'\n'}</Text>
      <Text>- An upgrade passively yields 🌾 for harvest. {'\n'}</Text>
      <Text style={styles.boldedText}>
        - Upgrade transactions are signed and SOL fees paid with the burner
        wallet!
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
