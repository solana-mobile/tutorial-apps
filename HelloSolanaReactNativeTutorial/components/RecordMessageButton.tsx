import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    AuthorizationResult,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Authorization, APP_IDENTITY } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, RpcResponseAndContext, SignatureResult, Transaction, TransactionInstruction, VersionedMessage } from '@solana/web3.js';
import {TextEncoder} from 'text-encoding';

type RecordMessageButtonProps = {
    authorization: Authorization,
    message: string
}

export default function RecordMessageButton({ authorization, message }: RecordMessageButtonProps) {
  const {connection} = useConnection()
  const recordMessage = async (messageBuffer: Buffer): Promise<[string, RpcResponseAndContext<SignatureResult>]>   => {
    const [signature] = await transact(async wallet => {
      const authResult: AuthorizationResult = await wallet.reauthorize({
          auth_token: authorization.authToken,
          identity: APP_IDENTITY
      })
      const latestBlockhash = await connection.getLatestBlockhash()
      const memoProgramTransaction = new Transaction({
        ...latestBlockhash,
        feePayer: authorization.publicKey
      }).add(
        new TransactionInstruction({
          data: messageBuffer,
          keys: [],
          programId: new PublicKey(
            'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
          ),
        }),
      );
      return await wallet.signAndSendTransactions({
        transactions: [memoProgramTransaction],
      });
    });
    return [signature, await connection.confirmTransaction(signature)]
  }
  const buttonDisabled = message === null || message.length === 0;
  const buttonStyle = buttonDisabled ? styles.disabled : styles.enabled
  return (
    <TouchableOpacity disabled={buttonDisabled} style={[styles.button, buttonStyle]} onPress={
        async () => {
            const result = await recordMessage(new TextEncoder().encode(message) as Buffer)
            if (result) {
                const [signature, response] = result
                const err = response.value.err
                if (err) {
                    console.log('Failed to record message:' + (err instanceof Error ? err.message : err))
                } else {
                    const explorerUrl =
                          'https://explorer.solana.com/tx/' +
                          signature +
                          '?cluster=' +
                          WalletAdapterNetwork.Devnet;
                    console.log('Successfully recorded a message. View your message at: ' + explorerUrl)
                }
            }
        }
    }>
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
    },
    disabled: {
        backgroundColor: 'gray',
        opacity: 0.5
    },
    enabled: {
      backgroundColor: '#007AFF',
  },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });
 