import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Authorization } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';

type AccountInfoProps = Readonly<{
  authorization: Authorization;
  onAirdropComplete: (authorization: Authorization) => void;
}>

const LAMPORTS_PER_AIRDROP = 100000000;

export default function RequestAirdropButton({ authorization, onAirdropComplete }: AccountInfoProps) {
  const {connection} = useConnection()
  
  const requestAirdrop = async () => {
    // Request an airdrop with with the connection class and
    // use Promise.all to also fetch the latest block hash in parallel.
    const [signature, latestBlockhash] = await Promise.all([
      connection.requestAirdrop(
        authorization.publicKey,
        LAMPORTS_PER_AIRDROP
      ),
      connection.getLatestBlockhash()
    ]);
    return await connection.confirmTransaction({
      signature: signature,
      ...latestBlockhash
    })
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