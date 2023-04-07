import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    AuthorizationResult,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Linking, View, Alert } from 'react-native';
import { Authorization, APP_IDENTITY } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, RpcResponseAndContext, SignatureResult, Transaction, TransactionInstruction } from '@solana/web3.js';
import {TextEncoder} from 'text-encoding';

type RecordMessageButtonProps = {
    authorization: Authorization,
    message: string
}

export default function RecordMessageButton({ authorization, message }: RecordMessageButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Record message</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginTop: 10,
      alignItems: 'center',
      backgroundColor: '#007AFF',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });
 