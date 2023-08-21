import {
  AnchorProvider,
  IdlAccounts,
  Program,
  Wallet as AnchorWallet,
} from '@coral-xyz/anchor';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {useCallback, useMemo} from 'react';

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
  return await program.account.farm.fetch(farmPDA);
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

  // Sign with local burner keypair
  tx.sign(burnerKeypair);

  const rawTransaction = tx.serialize();
  const txSig = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  });

  const result = await connection.confirmTransaction(
    {
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: txSig,
    },
    'finalized',
  );

  if (result.value.err) {
    throw new Error(JSON.stringify(result.value.err));
  }
  return txSig;
}
