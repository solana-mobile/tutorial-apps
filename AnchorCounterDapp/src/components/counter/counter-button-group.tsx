import React from "react";
import { View, StyleSheet } from "react-native";
import { Button} from "react-native-paper";
import { useCounterProgram } from "./counter-data-access";
import { useAuthorization } from "../../utils/useAuthorization";

export default function CounterButtonGroup() {
  const { selectedAccount } = useAuthorization();
  const { counterAccount, incrementCounter, initializeCounter } = useCounterProgram();

  // Check wallet and account status
  const isWalletConnected = !!selectedAccount;
  const accountExists = counterAccount.data?.status === "initialized";
  const isLoading = counterAccount.isLoading;

  // Button states
  const incrementDisabled = !isWalletConnected || !accountExists || isLoading;
  const initializeDisabled = !isWalletConnected || accountExists || isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.incrementButtonGroup}>
        <Button
          mode="contained"
          style={[
            styles.button, 
            styles.incrementButton,
            incrementDisabled && styles.disabledButton
          ]}
          labelStyle={[
            styles.buttonLabel,
            incrementDisabled && styles.disabledLabel
          ]}
          disabled={incrementDisabled}
          loading={incrementCounter.isPending}
          onPress={() => incrementCounter.mutateAsync(1)}
        >
          +1
        </Button>
        <Button
          mode="contained"
          style={[
            styles.button, 
            styles.incrementButton,
            incrementDisabled && styles.disabledButton
          ]}
          labelStyle={[
            styles.buttonLabel,
            incrementDisabled && styles.disabledLabel
          ]}
          disabled={incrementDisabled}
          loading={incrementCounter.isPending}
          onPress={() => incrementCounter.mutateAsync(5)}
        >
          +5
        </Button>
        <Button
          mode="contained"
          style={[
            styles.button, 
            styles.incrementButton,
            incrementDisabled && styles.disabledButton
          ]}
          labelStyle={[
            styles.buttonLabel,
            incrementDisabled && styles.disabledLabel
          ]}
          disabled={incrementDisabled}
          loading={incrementCounter.isPending}
          onPress={() => incrementCounter.mutateAsync(10)}
        >
          +10
        </Button>
      </View>

      <Button
        mode="contained"
        disabled={initializeDisabled}
        loading={initializeCounter.isPending}
        style={[
          styles.button, 
          styles.initializeButton,
          initializeDisabled && styles.disabledButton
        ]}
        labelStyle={[
          styles.buttonLabel,
          initializeDisabled && styles.disabledLabel
        ]}
        onPress={() => initializeCounter.mutateAsync()}
      >
        Initialize Counter
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    marginTop: 1,
  },
  incrementButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledLabel: {
    color: '#AAAAAA',
  },
  incrementButton: {
    flex: 1,
    backgroundColor: '#BB86FC',
  },
  initializeButton: {
    backgroundColor: '#03DAC5',
  },
  disabledButton: {
    backgroundColor: '#3A3A3A',
  },
});