import {StyleSheet, Text, View} from 'react-native';

type BalanceHeaderBarProps = {
  balance: string;
};

export default function BalanceHeaderBar({balance}: BalanceHeaderBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Balance: {balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(111, 111, 111, 0.2)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    marginBottom: 10, // to ensure the shadow is visible
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
