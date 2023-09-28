import {
  AnchorProvider,
  IdlAccounts,
  Program,
  Wallet as AnchorWallet,
} from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import {
  FarmingIdleProgram as FarmingGameProgram,
  IDL,
} from '../farming-idle-program/target/types/farming_idle_program';

export type FarmAccount = IdlAccounts<FarmingGameProgram>['farm'];
export type LeaderboardEntry =
  IdlAccounts<FarmingGameProgram>['leaderboard']['leaderboard'];

const FARMING_GAME_PROGRAM_ID = 'RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH';
const FARM_SEED = 'farm';
const LEADERBOARD_SEED = 'leaderboard';
const DEPOSIT_LAMPORTS_AMOUNT = LAMPORTS_PER_SOL / 1000; // 0.001 SOL

export function getFarmingGameProgram(
  connection: Connection,
  wallet?: AnchorWallet,
) {
  const MockWallet = {
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
    connection: connection,
    publicKey: Keypair.generate().publicKey,
  };

  const programProvider = new AnchorProvider(
    connection,
    wallet ?? MockWallet,
    AnchorProvider.defaultOptions(),
  );

  return new Program<FarmingGameProgram>(
    IDL as FarmingGameProgram,
    FARMING_GAME_PROGRAM_ID,
    programProvider,
  );
}

export function getFarmPDA(
  program: Program<FarmingGameProgram>,
  owner: PublicKey,
  player: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FARM_SEED), player.toBuffer(), owner.toBuffer()],
    new PublicKey(program.programId),
  );
}

export async function fetchFarmAccount(
  program: Program<FarmingGameProgram>,
  farmPDA: PublicKey,
) {
  try {
    return await program.account.farm.fetch(farmPDA, 'processed');
  } catch (e: any) {
    // Check for the specific uninitialized account error message
    if (
      typeof e?.message === 'string' &&
      e.message.startsWith('Account does not exist or has no data')
    ) {
      console.log('Farm account has not been initialized.');
      return null;
    }
    console.error(e);
    return null;
  }
}

export function getLeaderboardPDA(program: Program<FarmingGameProgram>) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LEADERBOARD_SEED)],
    new PublicKey(program.programId),
  );
}

export async function fetchLeaderboardAccount(
  program: Program<FarmingGameProgram>,
  leaderboardPDA: PublicKey,
) {
  try {
    return await program.account.leaderboard.fetch(leaderboardPDA, 'processed');
  } catch (e: any) {
    // Check for the specific uninitialized account error message
    if (
      typeof e?.message === 'string' &&
      e.message.startsWith('Account does not exist or has no data')
    ) {
      console.log('Leaderboard account has not been initialized.');
      return null;
    }
    console.error(e);
    return null;
  }
}

export async function getInitializeFarmIx(
  program: Program<FarmingGameProgram>,
  farmPDA: PublicKey,
  bump: number,
  owner: PublicKey,
  player: PublicKey,
) {
  const initializeFarmInstruction = await program.methods
    .initialize(bump)
    .accounts({
      farm: farmPDA,
      owner: owner,
      player: player,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return initializeFarmInstruction;
}

export async function getHarvestIx(
  program: Program<FarmingGameProgram>,
  farmPDA: PublicKey,
  player: PublicKey,
) {
  const initializeFarmInstruction = await program.methods
    .harvest()
    .accounts({
      farm: farmPDA,
      player: player,
    })
    .instruction();

  return initializeFarmInstruction;
}

export async function getWithdrawIx(
  program: Program<FarmingGameProgram>,
  owner: PublicKey,
  player: PublicKey,
) {
  // Currently, this is a simple transfer from player wallet to owner wallet.
  const playerBalance = await program.provider.connection.getBalance(player);
  return SystemProgram.transfer({
    fromPubkey: player,
    toPubkey: owner,
    lamports: playerBalance,
  });
}

export async function getUpgradeFarmIx(
  program: Program<FarmingGameProgram>,
  farmPDA: PublicKey,
  player: PublicKey,
  upgradeIndex: number,
  amount: number,
) {
  const upgradeFarmInstruction = await program.methods
    .upgradeFarm(upgradeIndex, amount)
    .accounts({
      farm: farmPDA,
      player: player,
    })
    .instruction();

  return upgradeFarmInstruction;
}

export function getDepositIx(owner: PublicKey, player: PublicKey) {
  return SystemProgram.transfer({
    fromPubkey: owner,
    toPubkey: player,
    lamports: DEPOSIT_LAMPORTS_AMOUNT,
  });
}

export async function getInitializeLeaderBoardIx(
  program: Program<FarmingGameProgram>,
  owner: PublicKey,
) {
  const [leaderboardPDA] = getLeaderboardPDA(program);
  const initializeLeaderboardInstruction = await program.methods
    .initializeLeaderboard()
    .accounts({
      leaderboard: leaderboardPDA,
      feePayer: owner,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  return initializeLeaderboardInstruction;
}

export async function signSendAndConfirmBurnerIx(
  connection: Connection,
  burnerKeypair: Keypair,
  instruction: TransactionInstruction,
  latestBlockhash?: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
  }>,
) {
  const _latestBlockhash =
    latestBlockhash ?? (await connection.getLatestBlockhash());

  const tx = new Transaction({
    ..._latestBlockhash,
    feePayer: burnerKeypair.publicKey,
  }).add(instruction);

  // Sign with local burner keypair
  tx.sign(burnerKeypair);

  return sendAndConfirmSignedTransaction(
    connection,
    tx.serialize(),
    _latestBlockhash,
  );
}

export async function signSendAndConfirmOwnerBurnerIx(
  connection: Connection,
  ownerWallet: Web3MobileWallet,
  ownerKey: PublicKey,
  burnerKeypair: Keypair,
  ix: TransactionInstruction,
  latestBlockhash?: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
  }>,
) {
  const _latestBlockhash =
    latestBlockhash ?? (await connection.getLatestBlockhash());

  const tx = new Transaction({
    ..._latestBlockhash,
    feePayer: ownerKey,
  }).add(ix);

  // Sign the tx first with the owner wallet
  const signedTransactions = await ownerWallet.signTransactions({
    transactions: [tx],
  });
  const ownerSignedTx = signedTransactions[0];

  // Sign with local burner keypair
  ownerSignedTx.partialSign(burnerKeypair);

  const rawTransaction = tx.serialize();
  return await sendAndConfirmSignedTransaction(
    connection,
    rawTransaction,
    _latestBlockhash,
  );
}

export async function signSendAndConfirmOwnerIx(
  connection: Connection,
  ownerWallet: Web3MobileWallet,
  ownerKey: PublicKey,
  ix: TransactionInstruction,
  latestBlockhash?: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
  }>,
) {
  const _latestBlockhash =
    latestBlockhash ?? (await connection.getLatestBlockhash());

  const tx = new Transaction({
    ..._latestBlockhash,
    feePayer: ownerKey,
  }).add(ix);

  // Sign the tx first with the owner wallet
  const signedTransactions = await ownerWallet.signTransactions({
    transactions: [tx],
  });
  const ownerSignedTx = signedTransactions[0];

  const rawTransaction = ownerSignedTx.serialize();
  return await sendAndConfirmSignedTransaction(
    connection,
    rawTransaction,
    _latestBlockhash,
  );
}

async function sendAndConfirmSignedTransaction(
  connection: Connection,
  rawTransaction: Buffer,
  latestBlockhash: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
  }>,
) {
  const txSig = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  });

  const result = await connection.confirmTransaction(
    {
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: txSig,
    },
    'processed',
  );

  if (result.value.err) {
    throw new Error(JSON.stringify(result.value.err));
  }
  return txSig;
}
