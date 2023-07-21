/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('readable-stream'),
      url: require.resolve('react-native-url-polyfill'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
