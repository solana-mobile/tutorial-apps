import {Keypair, PublicKey, PublicKeyInitData} from '@solana/web3.js';
import {base58_to_binary, binary_to_base58} from 'base58-js';
import * as SecureStore from 'expo-secure-store';
import {useCallback, useEffect, useState} from 'react';

const bs58 = require('bs58');
const BURNER_CACHE_KEY = 'burner-cache-key';

function cacheReviver(key: string, value: any) {
  if (key === 'publicKey') {
    return new PublicKey(value as PublicKeyInitData); // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
  } else if (key === 'secretKey') {
    return bs58.decode(value);
  } else {
    return value;
  }
}

const useBurnerWallet = () => {
  const [burnerKeypair, setBurnerKeypair] = useState<Keypair | null>(null);

  const fetchBurnerKeypair = useCallback(async () => {
    const result = await SecureStore.getItemAsync(BURNER_CACHE_KEY);
    if (result) {
      const parsedResult = JSON.parse(result, cacheReviver);
      return new Keypair(parsedResult);
    } else {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchAndStoreBurnerKeypair = async () => {
      const result = await fetchBurnerKeypair();
      setBurnerKeypair(result);
    };
    fetchAndStoreBurnerKeypair();
  }, [fetchBurnerKeypair]);

  const generateNewBurnerKeypair = useCallback(async () => {
    const newBurnerKeypair = Keypair.generate();
    await SecureStore.setItemAsync(
      BURNER_CACHE_KEY,
      JSON.stringify({
        publicKey: newBurnerKeypair.publicKey,
        secretKey: bs58.encode(newBurnerKeypair.secretKey),
      }),
    );
    setBurnerKeypair(newBurnerKeypair);
  }, []);

  return {
    burnerKeypair,
    generateNewBurnerKeypair,
  };
};

export default useBurnerWallet;
