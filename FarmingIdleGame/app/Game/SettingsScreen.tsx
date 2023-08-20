import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useAuthorization} from '../../storage/AuthorizationProvider';
import useBurnerWallet from '../../storage/useBurnerWallet';

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 5}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  );
}

const BalanceCard = ({title, subtitle, balance}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
    <Text style={styles.cardBalance}>{convertLamportsToSOL(balance)} SOL</Text>
  </View>
);

export default function SettingsScreen() {
  const {selectedAccount} = useAuthorization();
  const {burnerKeypair, generateNewBurnerKeypair} = useBurnerWallet();
  const [mainBalance, setMainBalance] = useState<number | null>(null);
  const [playerBalance, setPlayerBalance] = useState<number | null>(null);

  useEffect(() => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const fetchAndUpdateBalance = async (pubKey: PublicKey, setter) => {
      if (pubKey) {
        const fetchedBal = await connection.getBalance(pubKey);
        setter(fetchedBal);
      }
    };

    fetchAndUpdateBalance(selectedAccount?.publicKey, setMainBalance);
    fetchAndUpdateBalance(burnerKeypair?.publicKey, setPlayerBalance);
  }, [burnerKeypair, selectedAccount, setMainBalance, setPlayerBalance]);

  return (
    <View style={styles.container}>
      <Text>In Settings Screen</Text>
      <BalanceCard
        title="Main Wallet (Owner)"
        subtitle={selectedAccount?.publicKey.toString()}
        balance={mainBalance}
      />
      <BalanceCard
        title="Player Wallet (Burner)"
        subtitle={burnerKeypair?.publicKey.toString()}
        balance={playerBalance}
      />
      <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={generateNewBurnerKeypair}>
        <Text style={styles.text}>Reset Burner Wallet</Text>
      </Pressable>
      {/* <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={getBurnerKeypair}>
        <Text style={styles.text}>Get Burner Wallet</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 8,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
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
