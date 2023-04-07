import {
    AuthorizationResult,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Authorization, getPublicKeyFromAddress } from '../screens/MainScreen'

export const APP_IDENTITY = {
    name: 'React Native dApp',
};

type ConnectButtonProps = {
  onConnect: (authorization: Authorization) => void
}

export default function ConnectButton({ onConnect }: ConnectButtonProps) {
  const onPress = async () => {
    await transact(async wallet => {
      // Transact starts a session with the wallet app during which our app 
      // can send actions (like `authorize`) to the wallet.
      const authResult: AuthorizationResult = await wallet.authorize({
        cluster: 'devnet',
        identity: APP_IDENTITY,
      });
      const {accounts, auth_token} = authResult
      // fake only has one wallet acccount, so just use accounts[0]
      const publicKey = getPublicKeyFromAddress(accounts[0].address)

      // After authorizing, store the authResult with the onConnect callback we pass into the button
      onConnect({
        address: accounts[0].address,
        label: accounts[0].label,
        authToken: auth_token,
        publicKey: publicKey
      })
    });
  }
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
