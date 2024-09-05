# FirstMobileDapp

An introductory React Native Solana dApp that showcases basic Mobile Wallet Adapter usage and submitting transaction to the Solana network. 
This dApp also introduces and builds off of the [Solana Mobile Scaffold dApp](https://github.com/solana-mobile/solana-mobile-dapp-scaffold) template.

## Featured Libraries/Technology
- [Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/js/packages/mobile-wallet-adapter-protocol) for connecting to wallets and signing transactions/messages.
```wep3
c++'yarn create expo-app --template @solana-mobile/solana-mobile-expo-template
```
# The package 'solana-mobile-wallet-adapter-protocol' doesn't seem to be linked.

```yarn install @solana/web3.js \
  ```
# Connection

```const connection = new Connection("https://api.devnet.solana.com", "confirmed");

```
// `getLatestBlockhash` RPC request
const blockhash = await connection.getLatestBlockhash();

// `getBalance` RPC request
const balanceInLamports = await connection.getBalance();

// Sending a Transaction
const txSignature = await sendTransaction(tx);

import {
  Connection,
  PublicKey,
  VersionedTransaction,
  SystemProgram,
} from "@solana/web3.js";

// Create a list of Program instructions to execute.
const instructions = [
  SystemProgram.transfer({
    fromPubkey: fromPublicKey,
    toPubkey: toPublicKey,
    lamports: 1_000_000,
  }),
];

// Connect to an RPC endpoint and get the latest blockhash, to include in
// the transaction.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

// Create the "message" of a transaction and compile to `V0Message` format.
const txMessage = new TransactionMessage({
  payerKey: fromPublicKey,
  recentBlockhash: latestBlockhash.blockhash,
  instructions,
}).compileToV0Message();

// Construct the Versioned Transaction passing in the message.
const versionedTransaction = new VersionedTransaction(txMessage);

import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import {
  sendTransaction,
  clusterApiUrl,
  Connection,
  Transaction,
  confirmTransaction,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const signedTx: Transaction = await transact((wallet) => {
 ![chart](https://github.com/user-attachments/assets/61def837-e3e7-42b5-9b05-2e57d25c1b71)
 /* ...signing code from above... */
});

// After sending, a transaction signature is returned.
const txSignature = await sendTransaction(signedTx, connection);

// Confirm the transaction was successful.
const confirmationResult = await connection.confirmTransaction(
  txSignature,
  "confirmed"
);

if (confirmationResult.value.err) {
  throw new Error(JSON.stringify(confirmationResult.value.err));
} else {
  console.log("Transaction successfully submitted!");
}



react-native-get-random-values \
             buffer

- [web3.js](https://solana-labs.github.io/solana-web3.js/) for constructing transactions and submitting to the network with an RPC `connection` client.

## Prerequisites

If you haven't setup a React Native development environment for Android, you'll need to do that first. Follow the [Prerequisite Setup Guide](https://docs.solanamobile.com/getting-started/development-setup).

Follow the guide to make sure you:
- setup your Android and React Native development environment.
- have an Android device or emulator.
   
## Tutorial

See the [full walkthrough tutorial](https://docs.solanamobile.com/react-native/first_app_tutorial) to learn how to build the app.
