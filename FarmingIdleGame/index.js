// POLYFILLS/SHIMS
import {getRandomValues as expoCryptoGetRandomValues} from 'expo-crypto';

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto();

(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();


import 'expo-router/entry';
