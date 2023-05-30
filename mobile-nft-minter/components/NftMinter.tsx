import React from 'react';
import {LAMPORTS_PER_SOL, PublicKey, Transaction} from '@solana/web3.js';
import {StyleSheet, View, Text, Button} from 'react-native';
import {useAuthorization} from './providers/AuthorizationProvider';
import {useConnection} from './providers/ConnectionProvider';
import {bundlrStorage, Metaplex} from '@metaplex-foundation/js';
import {mobileWalletAdapterIdentity} from '../metaplex-util';
import useMetaplex from '../metaplex-util/useMetaplex';

function convertLamportsToSOL(lamports: number) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}).format(
    (lamports || 0) / LAMPORTS_PER_SOL,
  );
}

export default function NftMinter() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    'devnet',
  );

  console.log(metaplex);

  return (
    <View style={styles.container}>
      <Button title="Mint NFT" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
