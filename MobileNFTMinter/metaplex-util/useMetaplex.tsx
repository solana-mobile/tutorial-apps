import {Metaplex} from '@metaplex-foundation/js';

import {Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {Connection} from '@solana/web3.js';
import {useMemo} from 'react';
import {Account} from '../components/providers/AuthorizationProvider';
import {mobileWalletAdapterIdentity} from './mwaPlugin';

const useMetaplex = (
  connection: Connection,
  selectedAccount: Account | null,
  authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>,
) => {
  const metaplex = useMemo(() => {
    if (!selectedAccount && true) {
      return null;
    }
    return Metaplex.make(connection).use(
      mobileWalletAdapterIdentity(selectedAccount, authorizeSession),
    );
  }, [connection, selectedAccount, authorizeSession]);

  return {metaplex};
};

export default useMetaplex;
