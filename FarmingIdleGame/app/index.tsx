import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { router } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ConnectScreen() {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          router.replace('Game/CropsScreen')
        }}
        title="Authoriasdasdadsze"
      />
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
