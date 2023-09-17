import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {StyleSheet, Text, View} from 'react-native';

import {useAppState} from '../hooks/useAppState';
import {formatNumber} from '../program-utils/cropUpgrades';

function truncateNumberToDecimals(
  number: number,
  decimalPlaces: number,
): number {
  const multiplier = 10 ** decimalPlaces;
  return Math.floor(number * multiplier) / multiplier;
}

export default function BalanceHeaderBar() {
  const {playerBalance, ownerBalance, farmAccount} = useAppState();
  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceHeader}>Harvest points</Text>
        <Text style={styles.balanceText}>
          {farmAccount ? formatNumber(farmAccount.harvestPoints.toNumber()) : 0}
          🌾
        </Text>
      </View>
      <View style={styles.verticalLine} />
      <View style={styles.balanceSection}>
        <Text style={styles.balanceHeader}>Burner wallet</Text>
        <Text style={styles.balanceText}>
          {playerBalance
            ? truncateNumberToDecimals(
                playerBalance / LAMPORTS_PER_SOL,
                6,
              ).toFixed(6)
            : 0}{' '}
          SOL
        </Text>
      </View>
      <View style={styles.verticalLine} />

      <View style={styles.balanceSection}>
        <Text style={styles.balanceHeader}>Main wallet</Text>
        <Text style={styles.balanceText}>
          {ownerBalance
            ? truncateNumberToDecimals(ownerBalance / LAMPORTS_PER_SOL, 4)
            : 0}{' '}
          SOL
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: -1,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(111, 111, 111, 0.2)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    marginBottom: 10, // to ensure the shadow is visible
  },
  verticalLine: {
    marginVertical: 8,
    borderColor: 'rgba(111, 111, 111, 0.2)',
    borderLeftWidth: 1,
  },
  balanceSection: {
    paddingVertical: 15,
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceHeader: {
    fontSize: 12,
    color: 'gray',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
