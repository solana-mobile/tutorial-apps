// Import order is important!
import "react-native-get-random-values";
import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";
import { Buffer } from "buffer";

// Ensure Buffer is available globally with all methods
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

// Process polyfill
if (typeof global.process === "undefined") {
  global.process = require('process');
}

// Text encoding polyfills
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = require("text-encoding").TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = require("text-encoding").TextDecoder;
}

// Enhanced crypto polyfill
const customCrypto = {
  getRandomValues: expoCryptoGetRandomValues,
  randomUUID: () => {
    // Simple UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
} as any;

if (typeof global.crypto === "undefined") {
  global.crypto = customCrypto;
}

if (typeof window !== "undefined" && typeof window.crypto === "undefined") {
  Object.defineProperty(window, "crypto", {
    configurable: true,
    enumerable: true,
    get: () => customCrypto,
  });
}

// structuredClone polyfill
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = function structuredClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  };
}
