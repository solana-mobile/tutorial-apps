import React from 'react';
import {
  Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { toUint8Array } from 'js-base64';
import { PublicKey} from '@solana/web3.js';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Authorization } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';


type AccountInfoProps = Readonly<{
  authorization: Authorization;
  onAirdropComplete: (authorization: Authorization) => void;
}>

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

const LAMPORTS_PER_AIRDROP = 100000000;

export default function RequestAirdropButton({ authorization, onAirdropComplete }: AccountInfoProps) {
  const {connection} = useConnection()
  const publicKey = getPublicKeyFromAddress(authorization.address)
  
  const requestAirdrop = async () => {
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_AIRDROP
    )
    return await connection.confirmTransaction(signature)
  }

  return (
    <TouchableOpacity 
          style={styles.button} 
          onPress={async () => {
            const result = await requestAirdrop()
            const error = result?.value?.err
            if (error) {
              console.log('Failed to fund account: ' + (error instanceof Error ? error.message : error))
            } else {
              // Fetch and update balance
              onAirdropComplete(authorization)
            }
          }}>
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