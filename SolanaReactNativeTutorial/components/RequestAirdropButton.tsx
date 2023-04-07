import React from 'react';
import {
  Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { toUint8Array } from 'js-base64';
import { PublicKey} from '@solana/web3.js';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Authorization, getPublicKeyFromAddress } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';

type AccountInfoProps = Readonly<{
  authorization: Authorization;
  onAirdropComplete: (authorization: Authorization) => void;
}>

const LAMPORTS_PER_AIRDROP = 100000000;

export default function RequestAirdropButton({ authorization, onAirdropComplete }: AccountInfoProps) {

  return (
    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Request airdrop</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});