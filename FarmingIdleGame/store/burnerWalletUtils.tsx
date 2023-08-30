import {Keypair, PublicKey, PublicKeyInitData} from '@solana/web3.js';
import * as SecureStore from 'expo-secure-store';

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

export const generateNewBurnerKeypair = async () => {
  const newBurnerKeypair = Keypair.generate();
  await SecureStore.setItemAsync(
    BURNER_CACHE_KEY,
    JSON.stringify({
      publicKey: newBurnerKeypair.publicKey,
      secretKey: bs58.encode(newBurnerKeypair.secretKey),
    }),
  );
  return newBurnerKeypair;
};

export const fetchBurnerKeypair = async () => {
  const result = await SecureStore.getItemAsync(BURNER_CACHE_KEY);
  if (result) {
    const parsedResult = JSON.parse(result, cacheReviver);
    return new Keypair(parsedResult);
  } else {
    return await generateNewBurnerKeypair();
  }
};
