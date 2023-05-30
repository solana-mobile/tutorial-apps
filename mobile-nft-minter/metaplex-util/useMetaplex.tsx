import {bundlrStorage, Metaplex} from '@metaplex-foundation/js';
import {Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {Cluster, Connection} from '@solana/web3.js';
import {useState, useEffect} from 'react';
import {Account} from '../components/providers/AuthorizationProvider';
import {mobileWalletAdapterIdentity} from './mwaPlugin';

const useMetaplex = (
  connection: Connection,
  selectedAccount: Account | null,
  authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>,
  cluster: Cluster,
) => {
  const [metaplex, setMetaplex] = useState<Metaplex | null | undefined>();
  useEffect(() => {
    if (connection && selectedAccount && authorizeSession) {
      const newMetaplex = Metaplex.make(connection)
        .use(mobileWalletAdapterIdentity(selectedAccount, authorizeSession))
        .use(
          bundlrStorage({
            address: `https://${cluster}.bundlr.network`,
          }),
        );
      setMetaplex(newMetaplex);
    }
  }, [connection, selectedAccount, authorizeSession, cluster]);

  return {metaplex};
};

export default useMetaplex;
