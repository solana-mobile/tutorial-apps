import {Connection, PublicKey} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GameButton from '../../components/GameButton';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../store/useAppState';

export default function SettingsScreen() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const [ownerBalance, setOwnerBalance] = useState<number | null>(null);
  const [playerBalance, setPlayerBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {owner, playerKeypair, connection, withdrawPlayerBalance, resetPlayer} =
    useAppState();

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
    if (connection && playerKeypair) {
      console.log('fetching balance');
      fetchAndUpdateBalances(
        connection,
        owner,
        playerKeypair.publicKey,
        setOwnerBalance,
        setPlayerBalance,
      );
    }
  }, [owner, connection, fetchAndUpdateBalances, playerKeypair]);

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
        subtitle={playerKeypair?.publicKey.toString()}
        balance={playerBalance}
      />
      <GameButton
        text="Withdraw Player balance"
        disabled={!selectedAccount || !playerKeypair || isLoading}
        onPress={async () => {
          if (!selectedAccount || !playerKeypair) {
            throw new Error('Wallet is not initialized');
          }

          setIsLoading(true);
          try {
            await transact(async wallet => {
              const authResult = await authorizeSession(wallet);
              if (authResult.publicKey.toString() !== owner?.toString()) {
                throw Error('Incorrect wallet authorized for owner signing');
              }

              await withdrawPlayerBalance(wallet);
            });
          } catch (error: any) {
            console.error('Failed to initialize farm');
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
      />
      <GameButton
        text="Reset Player Wallet"
        disabled={!selectedAccount || !playerKeypair || isLoading}
        onPress={async () => {
          setIsLoading(true);
          try {
            await resetPlayer();
          } catch (error: any) {
            console.error('Failed to reset player');
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
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
