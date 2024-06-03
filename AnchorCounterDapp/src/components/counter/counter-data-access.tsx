import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";

import { BasicCounter as BasicCounterProgram } from "../../../counter-program/target/types/basic_counter";
import idl from "../../../counter-program/target/idl/basic_counter.json";
import { useConnection } from "../../utils/ConnectionProvider";
import { useAnchorWallet } from "../../utils/useAnchorWallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { alertAndLog } from "../../utils/alertAndLog";

const COUNTER_PROGRAM_ID = "ADraQ2ENAbVoVZhvH5SPxWPsF2hH5YmFcgx61TafHuwu";

export function useCounterProgram() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const counterProgramId = useMemo(() => {
    return new PublicKey(COUNTER_PROGRAM_ID);
  }, []);

  const [counterPDA] = useMemo(() => {
    const counterSeed = anchor.utils.bytes.utf8.encode("counter");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      counterProgramId
    );
  }, [counterProgramId]);

  const provider = useMemo(() => {
    if (!anchorWallet) {
      return;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "confirmed",
      commitment: "processed",
    });
  }, [anchorWallet, connection]);

  const counterProgram = useMemo(() => {
    if (!provider) {
      return;
    }

    return new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      provider
    );
  }, [counterProgramId, provider]);

  const counterAccount = useQuery({
    queryKey: ["get-counter-account"],
    queryFn: async () => {
      if (!counterProgram) {
        return null;
      }

      return await counterProgram.account.counter.fetch(counterPDA);
    },
  });

  const initializeCounter = useMutation({
    mutationKey: ["counter", "initialize"],
    mutationFn: async () => {
      if (!counterProgram) {
        throw Error("Counter program not instantiated");
      }

      return await counterProgram.methods
        .initialize()
        .accounts({ counter: counterPDA })
        .rpc();
    },
    onSuccess: (signature: string) => {
      return [signature, counterAccount.refetch()];
    },
    onError: (error: Error) => alertAndLog(error.name, error.message),
  });

  const incrementCounter = useMutation({
    mutationKey: ["counter", "increment"],
    mutationFn: async (amount: number) => {
      if (!counterProgram) {
        throw Error("Counter program not instantiated");
      }

      return await counterProgram.methods
        .increment(new anchor.BN(amount))
        .accounts({
          counter: counterPDA,
        })
        .rpc();
    },
    onSuccess: (signature: string) => {
      return [signature, counterAccount.refetch()];
    },
    onError: (error: Error) => alertAndLog(error.name, error.message),
  });

  return {
    counterProgram,
    counterProgramId,
    counterPDA,
    counterAccount,
    initializeCounter,
    incrementCounter,
  };
}
