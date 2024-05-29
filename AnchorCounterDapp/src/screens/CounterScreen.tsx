import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { CounterFeature } from "../components/counter/counter-feature";
export default function CounterScreen() {
  return (
    <>
      <View style={styles.screenContainer}>
        <Text
          style={{ fontWeight: "bold", marginBottom: 12 }}
          variant="displaySmall"
        >
          Onchain Counter
        </Text>
        <CounterFeature />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    height: "100%",
    padding: 16,
  },
});
