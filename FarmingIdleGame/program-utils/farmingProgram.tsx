import {
  AnchorProvider,
  IdlAccounts,
  Program,
  Wallet as AnchorWallet,
} from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
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

const FARMING_GAME_PROGRAM_ID = 'RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH';
const FARM_SEED = 'farm';

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
    return await program.account.farm.fetch(farmPDA);
  } catch (e) {
    // farmAccount has not been initialized
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

export async function signSendAndConfirmBurnerIx(
  connection: Connection,
  burnerKeypair: Keypair,
  instruction: TransactionInstruction,
) {
  const latestBlockhash = await connection.getLatestBlockhash();

  const tx = new Transaction({
    ...latestBlockhash,
    feePayer: burnerKeypair.publicKey,
  }).add(instruction);

  return signSendAndConfirmBurnerTx(
    connection,
    burnerKeypair,
    tx,
    latestBlockhash,
  );
}

export async function signSendAndConfirmOwnerBurnerIx(
  connection: Connection,
  ownerWallet: Web3MobileWallet,
  ownerKey: PublicKey,
  playerKeypair: Keypair,
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

  return signSendAndConfirmBurnerTx(
    connection,
    playerKeypair,
    ownerSignedTx,
    latestBlockhash,
  );
}

export async function signSendAndConfirmBurnerTx(
  connection: Connection,
  burnerKeypair: Keypair,
  tx: Transaction,
  latestBlockhash?: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
  }>,
) {
  const _latestBlockhash =
    latestBlockhash ?? (await connection.getLatestBlockhash());

  // Sign with local burner keypair
  tx.partialSign(burnerKeypair);

  const rawTransaction = tx.serialize();
  const txSig = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  });

  const result = await connection.confirmTransaction(
    {
      blockhash: _latestBlockhash.blockhash,
      lastValidBlockHeight: _latestBlockhash.lastValidBlockHeight,
      signature: txSig,
    },
    'finalized',
  );

  if (result.value.err) {
    throw new Error(JSON.stringify(result.value.err));
  }
  return txSig;
}
