import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useCounterProgram } from "./counter-data-access";
import { BN } from "@coral-xyz/anchor";

export default function CounterStats({ count = 99999999 }) {
  const [circleSize, setCircleSize] = useState(150);
  const { counterAccount } = useCounterProgram();

  const handleResizeCircle = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    const newSize = Math.max(Math.max(width, height) + 40, 150);
    setCircleSize(newSize);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          },
        ]}
      >
        <Text style={styles.count} onLayout={handleResizeCircle}>
          {counterAccount.data?.count instanceof BN
            ? counterAccount.data.count.toString()
            : "0"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  circle: {
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  count: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
