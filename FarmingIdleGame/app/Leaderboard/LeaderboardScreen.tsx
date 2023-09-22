import {StyleSheet, Text, View} from 'react-native';

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text>Leaderboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
