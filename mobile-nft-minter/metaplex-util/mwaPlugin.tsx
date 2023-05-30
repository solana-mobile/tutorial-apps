import {Metaplex, MetaplexPlugin} from '@metaplex-foundation/js';
import {Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {MobileWalletAdapterIdentityDriver} from './mwaIdentityDriver';
import {Account} from '../components/providers/AuthorizationProvider';

export const mobileWalletAdapterIdentity = (
  selectedAccount: Account,
  authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>,
): MetaplexPlugin => ({
  install(metaplex: Metaplex) {
    metaplex
      .identity()
      .setDriver(
        new MobileWalletAdapterIdentityDriver(
          selectedAccount,
          authorizeSession,
        ),
      );
  },
});
