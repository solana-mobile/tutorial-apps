import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useCounterProgram } from "./counter-data-access";
import { BN } from "@coral-xyz/anchor";

export default function CounterStats() {
  const [circleSize, setCircleSize] = useState(150);
  const [showDebug, setShowDebug] = useState(false); // State for debug visibility
  const { counterAccount, counterPDA } = useCounterProgram();


  // Get status message based on account state
  const getStatusMessage = () => {
    if (!counterAccount.data) return "Loading...";

    switch (counterAccount.data.status) {
      case "no-program":
        return "Waiting for wallet connection...";
      case "not-initialized":
        return "Counter needs initialization";
      case "initialized":
        if (!counterAccount.data.data?.count) {
          return "No counter value yet. Use increment buttons to add!";
        }
        return "Counter is active!";
      case "error":
        if (counterAccount.data.error?.message.includes("deserialize")) {
          return "Checking counter data...";
        }
        return `Error: ${counterAccount.data.error?.message || "Unknown error"}`;
      default:
        return "Unknown state";
    }
  };

  // Helper to safely get counter value
  const getCounterValue = () => {
    if (!counterAccount.data || counterAccount.data.status !== "initialized") {
      return "0";
    }
    
    const count = counterAccount.data.data?.count;
    // Handle both BN and number types
    if (count && typeof count === "object" && count !== null && (count as any) instanceof BN) {
      return (count as BN | number).toString();
    }
    return count?.toString() || "0";
  };

  // Update getRawAccountData function
  const getRawAccountData = () => {
    if (!counterAccount.data) return "No data";
    if (counterAccount.data.rawData) {
      // Convert Buffer to hex string for display
      return counterAccount.data.rawData.toString('hex');
    }
    return "No raw data available";
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2, // Changed back to circle
          },
        ]}
      >
        <Text style={styles.count}>
          {getCounterValue()}
        </Text>
      </View>

      {/* Status message */}
      <Text style={styles.status}>{getStatusMessage()}</Text>

      {/* Debug toggle button */}
      <TouchableOpacity 
        onPress={() => setShowDebug(!showDebug)}
        style={styles.debugToggle}
      >
        <Text style={styles.debugToggleText}>
          {showDebug ? 'Hide Solana Program Info' : 'Show Solana Program Info'}
        </Text>
        <IconButton 
          icon={showDebug ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          iconColor="#BB86FC"
        />
      </TouchableOpacity>

      {/* Debug info - conditionally rendered */}
      {showDebug && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>PDA: {counterPDA?.toBase58()}</Text>
          <Text style={styles.debugText}>
            Status: {counterAccount.data?.status || "loading"}
          </Text>
          <Text style={styles.debugText} numberOfLines={1}>
            Raw Data: {getRawAccountData()}
          </Text>
          <Text style={styles.debugText}>
            Parsed Count: {counterAccount.data?.data?.count?.toString() || "0"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  circle: {
    backgroundColor: '#1E1E1E',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  count: {
    fontSize: 48,
    fontWeight: "bold",
    color: '#FFFFFF',
  },
  status: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    color: '#BBBBBB',
    marginBottom: 8,
  },
  debugToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  debugToggleText: {
    color: '#BB86FC',
    fontSize: 14,
  },
  debugContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    color: '#AAAAAA',
    fontFamily: "monospace",
    marginBottom: 4,
  },
});