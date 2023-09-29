import {StyleSheet, Text, View} from 'react-native';

export default function DevResourcesScreen() {
  return (
    <View style={styles.container}>
      <Text>DevResources</Text>
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
