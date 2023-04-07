import {
    AuthorizationResult,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Authorization } from '../screens/MainScreen'

export const APP_IDENTITY = {
    name: 'React Native dApp',
};

type ConnectWalletButtonProps = {
  onConnect: (authorization: Authorization) => void
}

export default function ConnectWalletButton({ onConnect }: ConnectWalletButtonProps) {
  return (
    <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Connect Wallet</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      alignItems: 'center',
      width: '100%'
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
});
