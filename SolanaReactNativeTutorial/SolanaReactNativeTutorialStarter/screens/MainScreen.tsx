import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import {
  Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { useConnection } from '@solana/wallet-adapter-react';
import { toUint8Array } from 'js-base64';

export const APP_IDENTITY = {
  name: 'React Native dApp',
};

export type Authorization = Readonly<{
  address: Base64EncodedAddress;
  label?: string;
  publicKey: PublicKey;
  authToken: string;
}>;

export function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

export default function MainScreen() {
  const {connection} = useConnection()
  const [message, setMessage] = useState<string>("")
  return (
    <>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.header}>
                  <Text style={styles.headerText}>Hello Solana!</Text>
              </View>

              {/* Text Input */}
              <View>
                  <Text style={styles.inputHeader}>What's on your mind?</Text>
                  <TextInput
                  style={styles.input}
                  numberOfLines={1}
                  onChangeText={(text) => setMessage(text)}
                  placeholder="Write your message here"
                  />
              </View>
          </ScrollView>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 16,
    flex: 1
  },
  scrollContainer: {
    height: '100%',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputHeader: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%'
  },
});
