import React, {useState, useCallback} from 'react';
import {Alert, Button, Linking} from 'react-native';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  Transaction,
  TransactionInstruction,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
} from '@solana/web3.js';
import {TextEncoder} from 'text-encoding';
import {useAuthorization} from './AuthorizationProvider';
import {useConnection} from '@solana/wallet-adapter-react';
import {APP_CLUSTER} from '../App';

export const APP_IDENTITY = {
  name: 'Solana dApp Scaffold',
};

// Show an alert with an explorer link when we have
// a confirmed memo transaction.
function showExplorerAlert(memoTransactionSignature: string, cluster: string) {
  const explorerUrl =
    'https://explorer.solana.com/tx/' +
    memoTransactionSignature +
    '?cluster=' +
    cluster;
  Alert.alert(
    'Success!',
    'Your message was successfully recorded. View your message on Solana Explorer:',
    [
      {text: 'View', onPress: () => Linking.openURL(explorerUrl)},
      {text: 'Cancel', style: 'cancel'},
    ],
  );
}

export default function SendMemoButton() {
  const {authorizeSession} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);
  const {connection} = useConnection();

  const sendMemo = useCallback(
    async (
      messageBuffer: Buffer,
    ): Promise<[string, RpcResponseAndContext<SignatureResult>]> => {
      const latestBlockhash = await connection.getLatestBlockhash();
      const signature = await transact(async (wallet: Web3MobileWallet) => {
        // First, request for authorization from the wallet
        const authorizationResult = await authorizeSession(wallet);

        // Construct a 'Hello World' transaction
        const memoProgramTransaction = new Transaction({
          ...latestBlockhash,
          feePayer: authorizationResult.publicKey,
        }).add(
          new TransactionInstruction({
            data: messageBuffer,
            keys: [],
            programId: new PublicKey(
              'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', // Memo Program address
            ),
          }),
        );

        const transactionSignatures = await wallet.signAndSendTransactions({
          transactions: [memoProgramTransaction],
        });
        return transactionSignatures[0];
      });

      // Confirm the transaction
      const confirmationResponse = await connection.confirmTransaction({
        signature: signature,
        ...latestBlockhash,
      });

      return [signature, confirmationResponse];
    },
    [authorizeSession, connection],
  );

  return (
    <Button
      title="Send Memo!"
      disabled={signingInProgress}
      onPress={async () => {
        if (signingInProgress) {
          return;
        }
        setSigningInProgress(true);
        try {
          const message = 'Hello Solana!';
          const [memoTransactionSignature, confirmationResponse] =
            await sendMemo(new TextEncoder().encode(message) as Buffer);

          const err = confirmationResponse.value.err;
          if (err) {
            console.log(
              'Failed to record message:' +
                (err instanceof Error ? err.message : err),
            );
          } else {
            showExplorerAlert(memoTransactionSignature, APP_CLUSTER);
          }
        } finally {
          setSigningInProgress(false);
        }
      }}
    />
  );
}
