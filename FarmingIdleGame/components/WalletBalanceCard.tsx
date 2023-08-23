import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 5}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  );
}

type Props = Readonly<{
  title: string;
  subtitle: string | null | undefined;
  balance: number | null | undefined;
}>;

export default function WalletBalanceCard({title, subtitle, balance}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {!subtitle ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <Text style={styles.cardBalance}>
            {balance ? convertLamportsToSOL(balance) : 0} SOL
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 10,
  },
  cardBalance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
