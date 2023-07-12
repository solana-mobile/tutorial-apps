import {IdentityDriver} from '@metaplex-foundation/js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {Transaction} from '@solana/web3.js';
import {Account} from '../components/providers/AuthorizationProvider';

export class MobileWalletAdapterIdentityDriver implements IdentityDriver {
  public readonly selectedAccount: Account;
  public readonly authorizeSession: (
    wallet: Web3MobileWallet,
  ) => Promise<Account>;

  constructor(
    selectedAccount: Account,
    authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>,
  ) {
    this.selectedAccount = selectedAccount;
    this.authorizeSession = authorizeSession;
  }

  get publicKey() {
    return this.selectedAccount.publicKey;
  }

  public async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return await transact(async (wallet: Web3MobileWallet) => {
      // First, request for authorization from the wallet.
      await this.authorizeSession(wallet);

      // Sign the payload with the provided address from authorization.
      const signedMessages = await wallet.signMessages({
        addresses: [this.selectedAccount.publicKey.toBase58()],
        payloads: [message],
      });

      return signedMessages[0];
    });
  }

  public async signTransaction(transaction: Transaction): Promise<Transaction> {
    return await transact(async (wallet: Web3MobileWallet) => {
      // First, request for authorization from the wallet.
      await this.authorizeSession(wallet);

      // Sign the payload with the provided address from authorization.
      const signedTransactions = await wallet.signTransactions({
        transactions: [transaction],
      });

      return signedTransactions[0];
    });
  }

  public async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    return await transact(async (wallet: Web3MobileWallet) => {
      // First, request for authorization from the wallet.
      await this.authorizeSession(wallet);

      // Sign the payload with the provided address from authorization.
      return await wallet.signTransactions({transactions});
    });
  }
}
