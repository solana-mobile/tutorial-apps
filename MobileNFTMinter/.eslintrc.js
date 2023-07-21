module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: [
    // ...
    "react-hooks"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error", // For checking rules of hooks
    "react-hooks/exhaustive-deps": "warn" // For checking hook dependencies 
  }
  
};
