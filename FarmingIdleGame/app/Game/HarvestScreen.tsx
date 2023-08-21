import {Program} from '@coral-xyz/anchor';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useEffect, useState} from 'react';
import {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import FarmAccountInfo from '../../components/FarmAccountInfo';
import GameButton from '../../components/GameButton';
import {FarmingIdleProgram} from '../../farming-idle-program/target/types/farming_idle_program';
import {FarmAccount} from '../../farming-program-utils/accountTypes';
import {
  fetchFarmAccount,
  getFarmingGameProgram,
  getFarmPDA,
  getHarvestIx,
  getInitializeFarmIx,
  signSendAndConfirmBurnerIx,
} from '../../farming-program-utils/farmingProgram';
import {useAuthorization} from '../../storage/AuthorizationProvider';
import useBurnerWallet from '../../storage/useBurnerWallet';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

enum GameState {
  Loading = 'Loading',
  Uninitialized = 'Uninitialized',
  Initialized = 'Initialized',
}

export default function HarvestScreen() {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {burnerKeypair} = useBurnerWallet();
  const [farmAccount, setFarmAccount] = useState<FarmAccount | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.Loading);
  const connection = useMemo(() => {
    return new Connection(clusterApiUrl('devnet'));
  }, []);
  const farmingGameProgram = useMemo(() => {
    return getFarmingGameProgram(connection);
  }, [connection]);

  const fetchAndUpdateFarmAccount = useCallback(
    async (
      program: Program<FarmingIdleProgram>,
      owner: PublicKey,
      player: PublicKey,
    ) => {
      const [farmPDA] = getFarmPDA(farmingGameProgram, owner, player);
      const fetchedFarmAccount = await fetchFarmAccount(program, farmPDA);
      setFarmAccount(fetchedFarmAccount);
      setGameState(GameState.Initialized);
    },
    [farmingGameProgram],
  );

  useEffect(() => {
    if (burnerKeypair && selectedAccount) {
      fetchAndUpdateFarmAccount(
        farmingGameProgram,
        selectedAccount.publicKey,
        burnerKeypair.publicKey,
      );
    }
  }, [
    farmingGameProgram,
    burnerKeypair,
    selectedAccount,
    fetchAndUpdateFarmAccount,
  ]);

  return (
    <View style={styles.container}>
      <Text>In Harvest Screen</Text>

      {farmAccount ? (
        <>
          <FarmAccountInfo farmAccount={farmAccount} />
          <GameButton
            text="Harvest!"
            disabled={isFetching}
            onPress={async () => {
              if (!farmAccount || !burnerKeypair || !selectedAccount) {
                throw Error('Farm Account is uninitialized');
              }
              setIsFetching(true);

              const [farmPDA] = getFarmPDA(
                farmingGameProgram,
                selectedAccount.publicKey,
                burnerKeypair.publicKey,
              );
              const harvestIx = await getHarvestIx(
                farmingGameProgram,
                farmPDA,
                burnerKeypair.publicKey,
              );
              try {
                const txSig = await signSendAndConfirmBurnerIx(
                  connection,
                  burnerKeypair,
                  harvestIx,
                );

                console.log(txSig);
                await fetchAndUpdateFarmAccount(
                  farmingGameProgram,
                  selectedAccount.publicKey,
                  burnerKeypair.publicKey,
                );
              } catch (error: any) {
                console.error('Failed to harvest');
                console.error(error);
                throw error;
              } finally {
                setIsFetching(false);
              }
            }}
          />
        </>
      ) : (
        <Pressable
          style={styles.button}
          android_ripple={{
            color: 'rgba(255, 255, 255, 0.3)',
            borderless: false,
          }}
          onPress={async () => {
            if (!selectedAccount || !burnerKeypair) {
              throw new Error('Farm Account is uninitialized');
            }

            const [farmPDA, bump] = getFarmPDA(
              farmingGameProgram,
              selectedAccount.publicKey,
              burnerKeypair.publicKey,
            );
            await transact(async wallet => {
              const [authResult, initIx, latestBlockhash] = await Promise.all([
                authorizeSession(wallet),
                getInitializeFarmIx(
                  farmingGameProgram,
                  farmPDA,
                  bump,
                  selectedAccount.publicKey,
                  burnerKeypair.publicKey,
                ),
                connection.getLatestBlockhash(),
              ]);

              const initTx = new Transaction({
                ...latestBlockhash,
                feePayer: authResult.publicKey,
              }).add(initIx);

              // Sign the initTx first with the owner wallet
              const signedTransactions = await wallet.signTransactions({
                transactions: [initTx],
              });
              const ownerSignedTx = signedTransactions[0];

              // Then sign with the player/burner wallet
              ownerSignedTx.partialSign(burnerKeypair);

              const rawTransaction = ownerSignedTx.serialize();
              const txSig = await connection.sendRawTransaction(
                rawTransaction,
                {
                  skipPreflight: true,
                },
              );

              console.log(txSig);
            });
          }}>
          <Text style={styles.text}>Deposit</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
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
});
