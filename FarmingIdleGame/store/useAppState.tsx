import {Connection, Keypair, PublicKey, Transaction} from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {create} from 'zustand';

import {
  FarmAccount,
  fetchFarmAccount,
  getFarmingGameProgram,
  getFarmPDA,
  getHarvestIx,
  getInitializeFarmIx,
  getUpgradeFarmIx,
  getWithdrawIx,
  signSendAndConfirmBurnerIx,
  signSendAndConfirmOwnerBurnerIx,
} from '../program-utils/farmingProgram';
import {
  fetchBurnerKeypair,
  generateNewBurnerKeypair,
} from './burnerWalletUtils';

// Game State
export enum GameState {
  // App is still fetching/loading accounts
  Loading = 'Loading',
  // Farm PDA has not been initialized and account is not found
  Uninitialized = 'Uninitialized',
  // Farm PDA is initialized with an existing account.
  Initialized = 'Initialized',
}

interface GameStore {
  // State
  owner: PublicKey | null;
  playerKeypair: Keypair | null;
  connection: Connection | null;
  harvestPoints: number | null;
  farmPDA: PublicKey | null;
  bump: number | null;
  farmAccount: FarmAccount | null;
  gameState: GameState;

  // Actions
  onConnect: (owner: PublicKey, connection: Connection) => Promise<void>;
  initializeFarm: (mwaWallet: Web3MobileWallet) => Promise<void>;
  harvestFarm: () => Promise<void>;
  upgradeFarm: (upgradeIndex: number, amount: number) => Promise<void>;
  withdrawPlayerBalance: (mwaWallet: Web3MobileWallet) => Promise<void>;
  resetPlayer: () => Promise<void>;
}

export const useAppState = create<GameStore>()((set, get) => {
  const setupProgramState = async (
    owner: PublicKey,
    playerKeypair: Keypair,
    connection: Connection,
  ) => {
    const farmProgram = getFarmingGameProgram(connection);
    const [farmPDA, bump] = getFarmPDA(
      farmProgram,
      owner,
      playerKeypair.publicKey,
    );
    set({owner, playerKeypair, farmPDA, bump, connection});

    const farmAccount = (await connection.getAccountInfo(farmPDA))
      ? await fetchFarmAccount(farmProgram, farmPDA)
      : null;

    set({
      farmAccount,
      gameState: farmAccount ? GameState.Initialized : GameState.Uninitialized,
    });
  };
  return {
    owner: null,
    playerKeypair: null,
    connection: null,
    harvestPoints: null,
    farmPDA: null,
    bump: null,
    farmAccount: null,
    gameState: GameState.Loading,
    onConnect: async (owner: PublicKey, connection: Connection) => {
      console.log('=Game=: Connecting and setting up game state');
      const playerKeypair = await fetchBurnerKeypair();
      await setupProgramState(owner, playerKeypair, connection);
    },
    initializeFarm: async (mwaWallet: Web3MobileWallet) => {
      console.log('=Game=: Initializing farm');
      const {owner, playerKeypair, farmPDA, bump, connection, gameState} =
        get();
      if (gameState !== GameState.Uninitialized) {
        throw new Error(
          'Game state must be uninitialized to create a new farm.',
        );
      }
      if (owner && playerKeypair && farmPDA && bump && connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [initIx, latestBlockhash] = await Promise.all([
          getInitializeFarmIx(
            farmProgram,
            farmPDA,
            bump,
            owner,
            playerKeypair.publicKey,
          ),
          connection.getLatestBlockhash(),
        ]);

        await signSendAndConfirmOwnerBurnerIx(
          connection,
          mwaWallet,
          owner,
          playerKeypair,
          initIx,
          latestBlockhash,
        );

        const farmAccount = await fetchFarmAccount(farmProgram, farmPDA);
        set({
          farmAccount,
          gameState: GameState.Initialized,
        });
      }
    },
    harvestFarm: async () => {
      console.log('=Game=: Harvesting farm');

      const {owner, playerKeypair, farmPDA, bump, connection, gameState} =
        get();
      if (gameState !== GameState.Initialized) {
        throw new Error(
          'Game state must be initialized to harvest a new farm.',
        );
      }
      if (owner && playerKeypair && farmPDA && bump && connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [harvestIx, latestBlockhash] = await Promise.all([
          getHarvestIx(farmProgram, farmPDA, playerKeypair.publicKey),
          connection.getLatestBlockhash(),
        ]);

        try {
          await signSendAndConfirmBurnerIx(
            connection,
            playerKeypair,
            harvestIx,
            latestBlockhash,
          );

          const farmAccount = await fetchFarmAccount(farmProgram, farmPDA);

          set({
            farmAccount,
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    upgradeFarm: async (upgradeIndex: number, amount: number) => {
      console.log('=Game=: Upgrading farm');
      const {owner, playerKeypair, farmPDA, bump, connection, gameState} =
        get();
      if (gameState !== GameState.Initialized) {
        throw new Error('Game state must be initialized to upgrade a farm.');
      }
      if (owner && playerKeypair && farmPDA && bump && connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const harvestIx = await getUpgradeFarmIx(
          farmProgram,
          farmPDA,
          playerKeypair.publicKey,
          upgradeIndex,
          amount,
        );
        try {
          await signSendAndConfirmBurnerIx(
            connection,
            playerKeypair,
            harvestIx,
          );

          const farmAccount = await fetchFarmAccount(farmProgram, farmPDA);
          set({
            farmAccount,
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    withdrawPlayerBalance: async (mwaWallet: Web3MobileWallet) => {
      console.log('=Game=: Withdrawing player balance');
      const {owner, playerKeypair, farmPDA, bump, connection} = get();
      if (owner && playerKeypair && farmPDA && bump && connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [withdrawIx, latestBlockhash] = await Promise.all([
          getWithdrawIx(farmProgram, owner, playerKeypair.publicKey),
          connection.getLatestBlockhash(),
        ]);

        await signSendAndConfirmOwnerBurnerIx(
          connection,
          mwaWallet,
          owner,
          playerKeypair,
          withdrawIx,
          latestBlockhash,
        );

        const farmAccount = await fetchFarmAccount(farmProgram, farmPDA);
        set({
          farmAccount,
        });
      }
    },
    resetPlayer: async () => {
      console.log('=Game=: Resetting player and game state');
      const {owner, connection} = get();
      if (owner && connection) {
        const newPlayerKeypair = await generateNewBurnerKeypair();
        await setupProgramState(owner, newPlayerKeypair, connection);
      }
    },
  };
});