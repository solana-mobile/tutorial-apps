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

  const getInitializeFarmInstruction = useCallback(
    async (owner: PublicKey, player: PublicKey) => {
      console.log(owner.toString());
      console.log(player.toString());
      const [farmPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(FARM_SEED), player.toBuffer(), owner.toBuffer()],
        new PublicKey(FARMING_GAME_PROGRAM_ID),
      );

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
    [farmingProgram],
  );

  return {getInitializeFarmInstruction};
};

export default useFarmingGameProgram;
