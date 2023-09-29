import {Connection, Keypair, PublicKey} from '@solana/web3.js';
import {Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {create} from 'zustand';

import {
  FarmAccount,
  fetchFarmAccount,
  fetchLeaderboardAccount,
  getFarmingGameProgram,
  getFarmPDA,
  getHarvestIx,
  getInitializeFarmIx,
  getLeaderboardPDA,
  getSubmitFarmIx,
  getUpgradeFarmIx,
  getWithdrawIx,
  signSendAndConfirmBurnerIx,
  signSendAndConfirmOwnerBurnerIx,
} from '../program-utils/farmingProgram';
import {
  fetchBurnerKeypair,
  generateNewBurnerKeypair,
} from '../store/burnerWalletUtils';

// Game State
export enum GameState {
  // App is still fetching/loading accounts
  Loading = 'Loading',
  // Farm PDA has not been initialized and account is not found
  Uninitialized = 'Uninitialized',
  // Farm PDA is initialized with an existing account.
  Initialized = 'Initialized',
}

type LeaderboardEntryData = Readonly<{
  wallet: PublicKey;
  points: number;
}>;

interface GameStore {
  // Program Model
  owner: PublicKey | null;
  playerKeypair: Keypair | null;
  connection: Connection | null;
  harvestPoints: number | null;
  farmPDA: PublicKey | null;
  bump: number | null;
  farmAccount: FarmAccount | null;
  gameState: GameState;
  leaderboardEntries: Array<LeaderboardEntryData> | null;

  // Balance
  ownerBalance: number | null;
  playerBalance: number | null;

  // Account Listeners
  ownerListener: number | null;
  playerListener: number | null;

  // Actions
  onConnect: (owner: PublicKey, connection: Connection) => Promise<void>;
  initializeFarm: (mwaWallet: Web3MobileWallet) => Promise<void>;
  harvestFarm: () => Promise<number>;
  upgradeFarm: (upgradeIndex: number, amount: number) => Promise<void>;
  withdrawPlayerBalance: (mwaWallet: Web3MobileWallet) => Promise<void>;
  resetPlayer: () => Promise<void>;
  submitLeaderboard: (wallet: Web3MobileWallet) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
  refreshFarmAccount: () => Promise<void>;
  clearAppState: () => Promise<void>;
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

    // Initialize account listeners
    const ownerListener = connection.onAccountChange(owner, ownerAccount => {
      set({
        ownerBalance: ownerAccount.lamports,
      });
    });
    const playerListener = connection.onAccountChange(
      playerKeypair.publicKey,
      playerAccount => {
        set({
          playerBalance: playerAccount.lamports,
        });
      },
    );

    // Fetch initial account balances
    connection
      .getBalance(owner)
      .then(balance => {
        set({
          ownerBalance: balance,
        });
      })
      .catch(err => {
        set({
          ownerBalance: null,
        });
        console.log(`Error getting balance [${err}]`);
      });
    connection
      .getBalance(playerKeypair.publicKey)
      .then(balance => {
        set({
          playerBalance: balance,
        });
      })
      .catch(err => {
        set({
          playerBalance: null,
        });
        console.log(`Error getting balance [${err}]`);
      });

    // Fetch global leaderboard
    const [leaderboardPDA] = getLeaderboardPDA(farmProgram);
    fetchLeaderboardAccount(farmProgram, leaderboardPDA).then(
      leaderboardAccount => {
        if (leaderboardAccount) {
          const data = leaderboardAccount.leaderboard.map(entry => {
            return {
              wallet: entry.wallet,
              points: entry.points.toNumber(),
            };
          });
          // Sort entries in descending order
          data.sort((a, b) => b.points - a.points);
          set({leaderboardEntries: data});
        }
      },
    );

    set({
      owner,
      playerKeypair,
      farmPDA,
      bump,
      connection,
      ownerListener,
      playerListener,
    });

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
    leaderboardEntries: null,
    ownerBalance: null,
    playerBalance: null,
    ownerListener: null,
    playerListener: null,
    onConnect: async (owner: PublicKey, connection: Connection) => {
      console.log('=Game=: Connecting and setting up game state');
      const playerKeypair = await fetchBurnerKeypair(owner);
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

      const {
        owner,
        playerKeypair,
        farmPDA,
        bump,
        connection,
        gameState,
        farmAccount,
      } = get();
      if (gameState !== GameState.Initialized) {
        throw new Error(
          'Game state must be initialized to harvest a new farm.',
        );
      }
      if (
        owner &&
        playerKeypair &&
        farmPDA &&
        bump &&
        connection &&
        farmAccount
      ) {
        const farmProgram = getFarmingGameProgram(connection);
        const [harvestIx, latestBlockhash] = await Promise.all([
          getHarvestIx(farmProgram, farmPDA, playerKeypair.publicKey),
          connection.getLatestBlockhash(),
        ]);
        const beforePoints = farmAccount.harvestPoints;
        try {
          await signSendAndConfirmBurnerIx(
            connection,
            playerKeypair,
            harvestIx,
            latestBlockhash,
          );

          const fetchedFarmAccount = await fetchFarmAccount(
            farmProgram,
            farmPDA,
          );

          set({
            farmAccount: fetchedFarmAccount,
          });

          return fetchedFarmAccount
            ? fetchedFarmAccount.harvestPoints - beforePoints
            : 0;
        } catch (e) {
          console.error(e);
        }

        return 0;
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
        const newPlayerKeypair = await generateNewBurnerKeypair(owner);
        await setupProgramState(owner, newPlayerKeypair, connection);
      }
    },
    submitLeaderboard: async (wallet: Web3MobileWallet) => {
      const {owner, connection, farmPDA, playerKeypair} = get();
      if (connection && owner && farmPDA && playerKeypair) {
        const farmProgram = getFarmingGameProgram(connection);

        const submitFarmIx = await getSubmitFarmIx(
          farmProgram,
          farmPDA,
          owner,
          playerKeypair.publicKey,
        );

        await signSendAndConfirmOwnerBurnerIx(
          connection,
          wallet,
          owner,
          playerKeypair,
          submitFarmIx,
        );
      }
    },
    refreshLeaderboard: async () => {
      const {connection} = get();

      if (connection) {
        const farmProgram = getFarmingGameProgram(connection);
        const [leaderboardPDA] = getLeaderboardPDA(farmProgram);
        fetchLeaderboardAccount(farmProgram, leaderboardPDA).then(
          leaderboardAccount => {
            if (leaderboardAccount) {
              const data = leaderboardAccount.leaderboard.map(entry => {
                return {
                  wallet: entry.wallet,
                  points: entry.points.toNumber(),
                };
              });
              // Sort the entries in descending order
              data.sort((a, b) => b.points - a.points);
              set({leaderboardEntries: data});
            }
          },
        );
      }
    },
    refreshFarmAccount: async () => {
      const {connection, owner, playerKeypair} = get();

      if (connection && owner && playerKeypair) {
        const farmProgram = getFarmingGameProgram(connection);
        const [farmPDA] = getFarmPDA(
          farmProgram,
          owner,
          playerKeypair.publicKey,
        );
        fetchFarmAccount(farmProgram, farmPDA).then(farmAccount => {
          if (farmAccount) {
            set({farmAccount, harvestPoints: farmAccount.harvestPoints});
          }
        });
      }
    },
    clearAppState: async () => {
      set({
        owner: null,
        playerKeypair: null,
        connection: null,
        harvestPoints: null,
        farmPDA: null,
        bump: null,
        farmAccount: null,
        gameState: GameState.Loading,
        ownerBalance: null,
        playerBalance: null,
        ownerListener: null,
        playerListener: null,
      });
    },
  };
});
