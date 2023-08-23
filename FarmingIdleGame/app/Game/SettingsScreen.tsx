import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import GameButton from '../../components/GameButton';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import useBurnerWallet from '../../hooks/useBurnerWallet';
import {
  getFarmingGameProgram,
  getWithdrawIx,
  signSendAndConfirmBurnerIx,
} from '../../program-utils/farmingProgram';

export default function SettingsScreen() {
  const connection = useMemo(() => {
    return new Connection(clusterApiUrl('devnet'));
  }, []);
  const {selectedAccount} = useAuthorization();
  const {burnerKeypair, generateNewBurnerKeypair} = useBurnerWallet();
  const [ownerBalance, setOwnerBalance] = useState<number | null>(null);
  const [playerBalance, setPlayerBalance] = useState<number | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const fetchAndUpdateBalances = useCallback(
    async (
      _connection: Connection,
      ownerPubkey: PublicKey | undefined | null,
      playerPubkey: PublicKey | undefined | null,
      ownerSetter: (balance: number) => void,
      playerSetter: (balance: number) => void,
    ) => {
      const fetchBalance = (pubKey: PublicKey | null | undefined) =>
        pubKey ? _connection.getBalance(pubKey) : Promise.resolve(null);

      const [ownerBal, playerBal] = await Promise.all([
        fetchBalance(ownerPubkey),
        fetchBalance(playerPubkey),
      ]);

      ownerBal && ownerSetter(ownerBal);
      playerBal && playerSetter(playerBal);
    },
    [],
  );
  useEffect(() => {
    console.log('fetching balance');
    fetchAndUpdateBalances(
      connection,
      selectedAccount?.publicKey,
      burnerKeypair?.publicKey,
      setOwnerBalance,
      setPlayerBalance,
    );
  }, [
    burnerKeypair?.publicKey,
    connection,
    fetchAndUpdateBalances,
    selectedAccount?.publicKey,
  ]);

  return (
    <View style={styles.container}>
      <Text>In Settings Screen</Text>
      <WalletBalanceCard
        title="Main Wallet (Owner)"
        subtitle={selectedAccount?.publicKey.toString()}
        balance={ownerBalance}
      />
      <WalletBalanceCard
        title="Player Wallet (Burner)"
        subtitle={burnerKeypair?.publicKey.toString()}
        balance={playerBalance}
      />
      <GameButton
        text="Withdraw Player balance"
        disabled={!selectedAccount || !burnerKeypair || isWithdrawing}
        onPress={async () => {
          if (!selectedAccount || !burnerKeypair) {
            throw new Error('Wallets not initialized');
          }
          const farmProgram = getFarmingGameProgram(connection);
          const withdrawIx = await getWithdrawIx(
            farmProgram,
            selectedAccount?.publicKey,
            burnerKeypair.publicKey,
          );

          setIsWithdrawing(true);
          try {
            await signSendAndConfirmBurnerIx(
              connection,
              burnerKeypair,
              withdrawIx,
            );

            fetchAndUpdateBalances(
              connection,
              selectedAccount?.publicKey,
              burnerKeypair?.publicKey,
              setOwnerBalance,
              setPlayerBalance,
            );
          } catch (error: any) {
            console.error('Failed to withdraw');
            console.error(error);
            throw error;
          } finally {
            setIsWithdrawing(false);
          }
        }}
      />
      <GameButton
        text="Reset Player Wallet"
        onPress={generateNewBurnerKeypair}
      />
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
});
