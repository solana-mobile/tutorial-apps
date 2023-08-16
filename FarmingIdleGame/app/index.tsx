import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          transact(async (mobileWallet) => {
            const authorization = await mobileWallet.authorize({
              cluster: "devnet",
              identity: { name: "My Expo App" },
            });
            console.log(authorization);
          });
        }}
        title="Authorize"
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
