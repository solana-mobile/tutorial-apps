import {
    AuthorizationResult, Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Authorization } from '../screens/MainScreen'
import { toUint8Array } from 'js-base64';

export const APP_IDENTITY = {
    name: 'React Native dApp',
};

type ConnectWalletButtonProps = {
  onWalletConnect: (authorization: Authorization) => void
}

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

export default function ConnectWalletButton({ onWalletConnect }: ConnectWalletButtonProps) {
  const onConnect = async () => {
    await transact(async wallet => {
      const authResult: AuthorizationResult = await wallet.authorize({
        cluster: 'devnet',
        identity: APP_IDENTITY,
      });
      const {accounts, auth_token} = authResult
      const publicKey = getPublicKeyFromAddress(accounts[0].address)
      onWalletConnect({
        address: accounts[0].address,
        label: accounts[0].label,
        authToken: auth_token,
        publicKey: publicKey
      })
    });
  }
  return (
    <TouchableOpacity style={styles.button} onPress={onConnect}>
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
