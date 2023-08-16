import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ConnectScreen() {
  return (
    <View style={styles.container}>
      <Text>In Settings Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
