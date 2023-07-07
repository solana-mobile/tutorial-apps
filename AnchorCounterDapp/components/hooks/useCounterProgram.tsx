import {AnchorProvider, Program} from '@coral-xyz/anchor';
import {Connection, PublicKey} from '@solana/web3.js';
import {useMemo} from 'react';
import * as anchor from '@coral-xyz/anchor';

import {BasicCounter as BasicCounterProgram} from '../../basic-counter/target/types/basic_counter';
import idl from '../../basic-counter/target/idl/basic_counter.json';

export function useCounterProgram(
  connection: Connection,
  anchorWallet: anchor.Wallet,
) {
  const counterProgramId = useMemo(() => {
    return new PublicKey('5tH6v5gyhxnEjyVDQFjuPrH9SzJ3Rvj1Q4zKphnZsN74');
  }, []);

  const [counterAccountPubkey] = useMemo(() => {
    const counterSeed = anchor.utils.bytes.utf8.encode('counter');
    return anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      counterProgramId,
    );
  }, [counterProgramId]);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return null;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'processed',
    });
  }, [anchorWallet, connection]);

  const basicCounterProgram = useMemo(() => {
    if (!provider) {
      return null;
    }

    return new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      provider,
    );
  }, [counterProgramId, provider]);

  const value = useMemo(
    () => ({
      counterProgram: basicCounterProgram,
      counterProgramId: counterProgramId,
      counterAccountPubkey: counterAccountPubkey,
    }),
    [basicCounterProgram, counterProgramId, counterAccountPubkey],
  );

  return value;
}
