import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GameButton from '../../components/GameButton';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';

export default function SettingsScreen() {
  const {selectedAccount, authorizeSession, deauthorizeSession} =
    useAuthorization();
  const [isLoading, setIsLoading] = useState(false);

  const {
    owner,
    playerKeypair,
    withdrawPlayerBalance,
    resetPlayer,
    clearAppState,
    playerBalance,
    ownerBalance,
  } = useAppState();

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
        text="Disconnect Owner Wallet"
        disabled={!selectedAccount || !playerKeypair || isLoading}
        onPress={async () => {
          setIsLoading(true);
          try {
            await transact(async wallet => {
              await deauthorizeSession(wallet);
            });
            await clearAppState();
            router.replace('/');
          } catch (error: any) {
            console.error('Failed to disconnect wallet');
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
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
