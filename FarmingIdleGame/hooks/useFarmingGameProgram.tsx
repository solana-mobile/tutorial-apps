console.log('farming program');

import {Program} from '@coral-xyz/anchor';
import {PublicKey, SystemProgram} from '@solana/web3.js';
import {useMemo} from 'react';

import {
  FarmingIdleProgram as FarmingGameProgram,
  IDL,
} from '../farming-idle-program/target/types/farming_idle_program';

const FARMING_GAME_PROGRAM_ID = 'RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH';
const FARM_SEED = 'farm';

const useFarmingGameProgram = async (owner: PublicKey, player: PublicKey) => {
  const farmingProgram = useMemo(() => {
    return new Program<FarmingGameProgram>(
      IDL as FarmingGameProgram,
      FARMING_GAME_PROGRAM_ID,
    );
  }, []);

  const [farmPDA, bump] = useMemo(() => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(FARM_SEED), owner.toBuffer(), player.toBuffer()],
      new PublicKey(FARMING_GAME_PROGRAM_ID),
    );
  }, [owner, player]);

  const initializeFarmInstruction = useMemo(async () => {
    return await farmingProgram.methods
      .initialize(bump)
      .accounts({
        farm: farmPDA,
        owner: owner,
        player: player,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }, [bump, farmPDA, farmingProgram, owner, player]);

  return useMemo(() => {
    initializeFarmInstruction;
  }, [initializeFarmInstruction]);
};

export default useFarmingGameProgram;
