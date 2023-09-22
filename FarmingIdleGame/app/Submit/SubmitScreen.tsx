import {StyleSheet, Text, View} from 'react-native';

export default function SubmitScreen() {
  return (
    <View style={styles.container}>
      <Text>Submit your score</Text>
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
