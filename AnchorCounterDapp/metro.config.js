// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add polyfill resolvers
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('expo-crypto'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
};

// Ensure proper polyfill loading
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;
