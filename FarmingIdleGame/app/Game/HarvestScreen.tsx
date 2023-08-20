import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import useFarmingGameProgram from '../../hooks/useFarmingGameProgram';
import {useAuthorization} from '../../storage/AuthorizationProvider';
import useBurnerWallet from '../../storage/useBurnerWallet';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function HarvestScreen() {
  const {authorizeSession, selectedAccount} = useAuthorization();
  const {burnerKeypair} = useBurnerWallet();
  const {getInitializeFarmInstruction, fetchFarmAccount} =
    useFarmingGameProgram();

  // useEffect(() => {
  //   const farmAccount = await fetchFarmAccount(
  //     selectedAccount.publicKey,
  //     burnerKeypair.publicKey,
  //   );
  //   console.log(farmAccount);
  // }, [burnerKeypair.publicKey, fetchFarmAccount, selectedAccount.publicKey]);

  return (
    <View style={styles.container}>
      <Text>In Harvest Screen</Text>
      <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={async () => {
          const farmAccount = await fetchFarmAccount(
            selectedAccount.publicKey,
            burnerKeypair.publicKey,
          );
          console.log(farmAccount);
        }}>
        <Text style={styles.text}>Fetch Farm PDA</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={async () => {
          const connection = new Connection(clusterApiUrl('devnet'));
          await transact(async wallet => {
            const [authResult, initIx, latestBlockhash] = await Promise.all([
              authorizeSession(wallet),
              getInitializeFarmInstruction(
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
            console.log(burnerKeypair);

            ownerSignedTx.partialSign(burnerKeypair);

            const rawTransaction = ownerSignedTx.serialize();
            const txSig = await connection.sendRawTransaction(rawTransaction, {
              skipPreflight: true,
            });

            console.log(txSig);
          });
        }}>
        <Text style={styles.text}>Deposit</Text>
      </Pressable>
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
