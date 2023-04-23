import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Authorization} from '../screens/MainScreen';

type DisconnectButtonProps = {
  onDisconnect: () => void;
  authorization: Authorization;
};

export default function DisconnectButton({
  onDisconnect,
  authorization,
}: DisconnectButtonProps) {
  const onPress = async () => {
    await transact(async wallet => {
      await wallet.deauthorize({
        auth_token: authorization.authToken,
      });
      // Set auth token to null
      onDisconnect();
    });
  };
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
