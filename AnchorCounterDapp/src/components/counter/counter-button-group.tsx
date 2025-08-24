import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCounterProgram } from "./counter-data-access";
import { useAuthorization } from "../../utils/useAuthorization";

export default function CounterButtonGroup() {
  const { selectedAccount } = useAuthorization();
  const { counterAccount, incrementCounter, initializeCounter } =
    useCounterProgram();

  // Is wallet connected and account fetched
  const isReady = selectedAccount && counterAccount.isSuccess;
  const isCounterInitialized = !!counterAccount.data;

  const incrementDisabled = !isReady || !isCounterInitialized;
  const initializeDisabled = !isReady || isCounterInitialized;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.incrementButtonGroup}>
          <Button
            mode="contained-tonal"
            style={styles.incrementButton}
            disabled={incrementDisabled}
            loading={incrementCounter.isPending}
            onPress={() => incrementCounter.mutateAsync(1)}
          >
            +1
          </Button>
          <Button
            mode="contained-tonal"
            style={styles.incrementButton}
            disabled={incrementDisabled}
            loading={incrementCounter.isPending}
            onPress={() => incrementCounter.mutateAsync(5)}
          >
            +5
          </Button>
          <Button
            mode="contained-tonal"
            style={styles.incrementButton}
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
          style={styles.initializeButton}
          onPress={() => initializeCounter.mutateAsync()}
        >
          {!selectedAccount 
            ? "Connect Wallet First" 
            : isCounterInitialized 
              ? "Counter Initialized" 
              : counterAccount.isLoading 
                ? "Loading..." 
                : "Initialize Counter"
          }
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
  },
  incrementButtonGroup: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  initializeButton: {
    marginHorizontal: 4,
    marginTop: 8,
  },
  incrementButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
