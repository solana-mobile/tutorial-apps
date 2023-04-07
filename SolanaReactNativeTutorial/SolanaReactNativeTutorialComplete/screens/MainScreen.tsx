import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import {
  Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { useConnection } from '@solana/wallet-adapter-react';
import { toUint8Array } from 'js-base64';

import AccountInfo from '../components/AccountInfo';
import RecordMessageButton from '../components/RecordMessageButton';
import ConnectButton from '../components/ConnectButton';
import RequestAirdropButton from '../components/RequestAirdropButton';
import DisconnectButton from '../components/DisconnectButton';

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
  const [authorization, setAuthorization] = useState<Authorization | null>(null);
  const [balance, setBalance] = useState<number | null>(null)

  const fetchAndUpdateBalance = async (authorization: Authorization) => {
    const balance = await connection.getBalance(authorization.publicKey)
    console.log("Balance fetched: " + balance)
    setBalance(balance)
  }
  useEffect(() => {
    if (!authorization) {
      return;
    }
    fetchAndUpdateBalance(authorization)
  }, [authorization])

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

              {authorization !== null ? <AccountInfo authorization={authorization} balance={balance} /> : null}
              <View style={styles.buttonGroup}>
                {authorization !== null ? <RequestAirdropButton authorization={authorization} 
                                          onAirdropComplete={(authorization: Authorization) => {fetchAndUpdateBalance(authorization)}} /> : null }
                {authorization !== null ? <RecordMessageButton authorization={authorization} message={message} /> : null }

              </View>
          </ScrollView>
          
          {authorization === null ? 
              <ConnectButton onConnect={async (authorization: Authorization) => { setAuthorization(authorization) }} /> :
              <DisconnectButton authorization={authorization} onDisconnect={() => {
                setAuthorization(null);
                setBalance(null);
              }} />
          }
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  }
});
