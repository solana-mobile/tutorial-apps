console.log('harvest');

import {Keypair} from '@solana/web3.js';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import useFarmingGameProgram from '../../hooks/useFarmingGameProgram';

export default function HarvestScreen() {
  // const[] = useFarmingGameProgram(owner, player);
  // const onDeposit =

  const createBurnerWallet = useCallback(() => {
    const burnerKeypair = Keypair.generate();
    console.log(burnerKeypair);
  }, []);

  return (
    <View style={styles.container}>
      <Text>In Harvest Screen</Text>
      <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={createBurnerWallet}>
        <Text style={styles.text}>Create Burner Wallet</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        android_ripple={{color: 'rgba(255, 255, 255, 0.3)', borderless: false}}
        onPress={() => {}}>
        <Text style={styles.text}>Deposit</Text>
      </Pressable>
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
