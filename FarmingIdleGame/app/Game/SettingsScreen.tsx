import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

import BalanceHeaderBar from '../../components/BalanceHeaderBar';
import GameButton from '../../components/GameButton';
import InfoCard from '../../components/InfoCard';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import {useAuthorization} from '../../hooks/AuthorizationProvider';
import {useAppState} from '../../hooks/useAppState';

function truncatePublicKey(pubKeyString: string) {
  return `${pubKeyString.slice(0, 5)}...${pubKeyString.slice(
    pubKeyString.length - 5,
    pubKeyString.length,
  )}`;
}

function bs64To58(bs64String: string) {
  const bytes = Buffer.from(bs64String, 'base64');
  return new PublicKey(bytes).toBase58();
}

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 5}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  );
}

export default function SettingsScreen() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const [isLoading, setIsLoading] = useState(false);

  const {
    owner,
    playerKeypair,
    withdrawPlayerBalance,
    resetPlayer,
    playerBalance,
    ownerBalance,
  } = useAppState();

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/crystal_background.jpg')}>
      {/* <BalanceHeaderBar /> */}
      <View style={styles.container}>
        <InfoCard
          title="Main Wallet"
          subtitle={
            selectedAccount
              ? truncatePublicKey(bs64To58(selectedAccount.address))
              : null
          }
          onPress={() => {
            router.push('/Wallets');
          }}>
          <Text style={styles.cardBalance}>
            {ownerBalance ? convertLamportsToSOL(ownerBalance) : 0} SOL
          </Text>
        </InfoCard>
        <InfoCard
          title="Player Wallet"
          subtitle={
            playerKeypair
              ? truncatePublicKey(playerKeypair.publicKey.toBase58())
              : null
          }
          onPress={() => {
            router.push('/Wallets');
          }}>
          <Text style={styles.cardBalance}>
            {playerBalance ? convertLamportsToSOL(playerBalance) : 0} SOL
          </Text>
        </InfoCard>

        <InfoCard
          title="Leaderboards"
          subtitle={'View the global Top 5 farms.'}
          onPress={() => {
            router.push('/Leaderboard');
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

        <GameButton
          text="Mint Farm NFT"
          disabled={!selectedAccount || !playerKeypair || isLoading}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainButtonSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
