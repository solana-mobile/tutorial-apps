# Simple Storage dApp

This is a reference app that demonstrates MWA authToken persistent storage, using `AsyncStorage`. Caching the authToken allows
a priorly authorized user to resume "connection" to wallets even after closing the app.

It is an exact clone of the scaffold dApp, with the only difference in `AuthorizationProvider`, where the `AsyncStorage` solution is added.

## Featured Libarires
- [Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/js/packages/mobile-wallet-adapter-protocol) for connecting to wallets and signing transactions/messages
- [web3.js](https://solana-labs.github.io/solana-web3.js/) for constructing transactions and an RPC `connection` client.
- [async-storage](https://github.com/react-native-async-storage/async-storage) for caching Mobile Wallet Adapter authorization information.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/3d83d3dc-ab65-4a2c-881d-8a229f34e392" alt="Scaffold dApp Screenshot 1" width=300 />
    </td>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/2fd69bd4-834d-45e1-8c7a-f80b5b576c96" alt="Scaffold dApp Screenshot 3" width=300 />
    </td>
    <td align="center">
      <img src="https://github.com/solana-mobile/solana-mobile-dapp-scaffold/assets/18451967/cdd93c12-d9ff-4739-81af-92da5b90303a" alt="Scaffold dApp Screenshot 2" width=300 />
    </td>
  </tr>
</table>

## Prerequisites

If you haven't setup a React Native development environment for Android, you'll need to do that first. Follow the [Prerequisite Setup Guide](https://docs.solanamobile.com/getting-started/development-setup).

Follow the guide to make sure you:
- setup your Android and React Native development environment.
- have an Android device or emulator.
- install an MWA compliant wallet app on your device/emulator.
   
## Tutorial

WIP


