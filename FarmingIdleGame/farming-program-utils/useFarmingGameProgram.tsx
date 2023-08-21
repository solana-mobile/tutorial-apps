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
import {getFarmingGameProgram} from './farmingProgram';

const FARMING_GAME_PROGRAM_ID = 'RkoKjJ7UVatbVegugEjq11Q5agPynBAZV2VhPrNp5kH';
const FARM_SEED = 'farm';

// TODO: Refactor out of custom hook
const useFarmingGameProgram = (
  connection: Connection,
  owner: PublicKey | null | undefined,
  player: PublicKey | null | undefined,
  playerKeypair: Keypair | null | undefined,
) => {
  // const player = playerKeypair?.publicKey;
  return useMemo(() => {
    console.log('in program creation');
    console.log(player);
    const farmingGameProgram = getFarmingGameProgram(connection);
    if (!player || !owner) {
      return {farmingGameProgram, farmPDA: null, bump: null};
    }
    const [farmPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(FARM_SEED), player.toBuffer(), owner.toBuffer()],
      new PublicKey(FARMING_GAME_PROGRAM_ID),
    );
    return {farmingGameProgram, farmPDA, bump};
  }, [connection, owner, player]);
};

export default useFarmingGameProgram;
