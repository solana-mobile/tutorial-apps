console.log('farming program');

import {Program} from '@coral-xyz/anchor';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import {useCallback, useMemo} from 'react';

import {
  FarmingIdleProgram as FarmingGameProgram,
  IDL,
} from '../farming-idle-program/target/types/farming_idle_program';

const FARMING_GAME_PROGRAM_ID = 'RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH';
const FARM_SEED = 'farm';

// TODO: Refactor out of custom hook
const useFarmingGameProgram = () => {
  const farmingProgram = useMemo(() => {
    const MockWallet = {
      signTransaction: () => Promise.reject(),
      signAllTransactions: () => Promise.reject(),
      connection: new Connection(clusterApiUrl('devnet')),
      publicKey: undefined,
    };

    return new Program<FarmingGameProgram>(
      IDL as FarmingGameProgram,
      FARMING_GAME_PROGRAM_ID,
      MockWallet,
    );
  }, []);

  const getFarmPDA = useCallback((owner: PublicKey, player: PublicKey) => {
    const [farmPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(FARM_SEED), player.toBuffer(), owner.toBuffer()],
      new PublicKey(FARMING_GAME_PROGRAM_ID),
    );
    return {farmPDA, bump};
  }, []);

  const fetchFarmAccount = useCallback(
    async (owner: PublicKey, player: PublicKey) => {
      const {farmPDA} = getFarmPDA(owner, player);
      return await farmingProgram.account.farm.fetch(farmPDA);
    },
    [farmingProgram, getFarmPDA],
  );

  const getInitializeFarmInstruction = useCallback(
    async (owner: PublicKey, player: PublicKey) => {
      const {farmPDA, bump} = getFarmPDA(owner, player);

      const initializeFarmInstruction = await farmingProgram.methods
        .initialize(bump)
        .accounts({
          farm: farmPDA,
          owner: owner,
          player: player,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      return initializeFarmInstruction;
    },
    [farmingProgram, getFarmPDA],
  );

  return {getInitializeFarmInstruction, getFarmPDA, fetchFarmAccount};
};

export default useFarmingGameProgram;
