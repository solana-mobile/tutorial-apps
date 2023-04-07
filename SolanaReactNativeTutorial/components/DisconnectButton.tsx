import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Authorization } from '../screens/MainScreen'

type DisconnectWalletButtonProps = {
  onDisconnect: () => void
  authorization: Authorization
}


export default function DisconnectWalletButton({ onDisconnect, authorization }: DisconnectWalletButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Disconnect Wallet</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'red',
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
