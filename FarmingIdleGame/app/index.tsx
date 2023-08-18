// import '../crypto-shim';

console.log('index');
import {Keypair} from '@solana/web3.js';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {router} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useCallback, useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';

export const APP_IDENTITY = {
  name: 'Farming Idle Game',
  uri: 'https://solanamobile.com',
  icon: 'favicon.ico',
};

export default function ConnectScreen() {
  const [owner, setOwner] = useState(undefined);

  useEffect(() => {
    if (owner) {
      console.log('Route to crops screen');
      router.replace('Game/HarvestScreen');
    }
  }, [owner]);

  const createBurnerWallet = useCallback(() => {
    console.log(global.crypto);
    const burnerKeypair = Keypair.generate();
    console.log(burnerKeypair);
  }, []);

  return (
    <View style={styles.container}>
      <Button
        onPress={createBurnerWallet}
        // onPress={async () => {
        //   const connectedAccount = await transact(async wallet => {
        //     const auth = await wallet.authorize({
        //       cluster: 'devnet',
        //       identity: APP_IDENTITY,
        //     });

        //     return auth.accounts[0];
        //   });
        //   console.log('Setting owner');
        //   console.log(connectedAccount);
        //   setOwner(connectedAccount);
        // }}
        title="Connect"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
