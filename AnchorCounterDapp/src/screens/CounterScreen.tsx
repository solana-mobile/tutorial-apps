import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { CounterFeature } from "../components/counter/counter-feature";

export default function CounterScreen() {
  return (
    <ScrollView contentContainerStyle={ styles.scrollContainer }>
      <View style={styles.screenContainer}>
        <Text
          style={styles.title}
          variant="displaySmall"
        >
          Onchain Counter
        </Text>
        <CounterFeature />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#904e95',
  },
  title: {
    fontWeight: "bold", 
    marginBottom: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
