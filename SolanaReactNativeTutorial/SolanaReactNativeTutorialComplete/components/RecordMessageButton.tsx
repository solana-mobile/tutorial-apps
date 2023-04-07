import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Linking, View, Alert } from 'react-native';
import { Authorization, APP_IDENTITY } from '../screens/MainScreen'
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, RpcResponseAndContext, SignatureResult, Transaction, TransactionInstruction } from '@solana/web3.js';
import {TextEncoder} from 'text-encoding';

type RecordMessageButtonProps = {
    authorization: Authorization,
    message: string
}

async function recordMessage(authorization: Authorization, messageBuffer: Buffer): Promise<[string, RpcResponseAndContext<SignatureResult>]> {
  const {connection} = useConnection()
  const [signature] = await transact(async wallet => {
    // Start a wallet session with `transact` and `reauthorize` our dApp by passing in the `authToken`.
    // Use Promise.all to also fetch the latest block hash in parallel.
    const [authResult, latestBlockhash] = await Promise.all([
      wallet.reauthorize({
        auth_token: authorization.authToken,
        identity: APP_IDENTITY
      }),
      connection.getLatestBlockhash(),
    ]);

    // Construct a `Transaction` with an instruction to invoke the `MemoProgram`.
    const memoProgramTransaction = new Transaction({
      ...latestBlockhash,
      feePayer: authorization.publicKey
    }).add(
      new TransactionInstruction({
        data: messageBuffer, 
        keys: [],
        programId: new PublicKey(
          'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', // Memo Program address
        ),
      }),
    );

    // Send a `signAndSendTransactions` request to the wallet. The wallet will sign the transaction with the private key and send it to devnet.
    return await wallet.signAndSendTransactions({
      transactions: [memoProgramTransaction],
    });
  });

  const latestBlockhash = await connection.getLatestBlockhash()
  return [signature, await connection.confirmTransaction({
    signature: signature,
    ...latestBlockhash
  })]
}

export default function RecordMessageButton({ authorization, message }: RecordMessageButtonProps) {
  const buttonDisabled = message === null || message.length === 0;
  const buttonStyle = buttonDisabled ? styles.disabled : styles.enabled
  return (
    <TouchableOpacity disabled={buttonDisabled} style={[styles.button, buttonStyle]} onPress={
        async () => {
            const result = await recordMessage(authorization, new TextEncoder().encode(message) as Buffer)
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
                    Alert.alert(
                      'Success!',
                      'Your message was successfully recorded. View your message on Solana Explorer:',
                      [
                        { text: 'View', onPress: () => Linking.openURL(explorerUrl) },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    );
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
 