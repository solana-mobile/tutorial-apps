import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";

import { BasicCounter as BasicCounterProgram } from "../../../counter-program/target/types/basic_counter";
import idl from "../../../counter-program/target/idl/basic_counter.json";
import { useConnection } from "../../utils/ConnectionProvider";
import { useAnchorWallet } from "../../utils/useAnchorWallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { alertAndLog } from "../../utils/alertAndLog";
import { useMobileWallet } from "../../utils/useMobileWallet";

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

export function useCounterProgram2() {
  const { connection } = useConnection();
  const mobileWallet = useMobileWallet();

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

  const counterProgram = useMemo(() => {
    return new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId
    );
  }, [counterProgramId]);

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
    mutationFn: async (payer: PublicKey) => {
      const initializeIx = await counterProgram.methods
        .initialize()
        .accounts({
          counter: counterPDA,
          payer,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [initializeIx],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageLegacy);

      return await mobileWallet.signAndSendTransaction(transaction);
    },
    onSuccess: (signature: string) => {
      return [signature, counterAccount.refetch()];
    },
    onError: (error: Error) => alertAndLog(error.name, error.message),
  });

  const incrementCounter = useMutation({
    mutationKey: ["counter", "increment"],
    mutationFn: async ({
      payer,
      amount,
    }: {
      payer: PublicKey;
      amount: number;
    }) => {
      const incrementIx = await counterProgram.methods
        .increment(new anchor.BN(amount))
        .accounts({
          counter: counterPDA,
        })
        .instruction();

      const latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [incrementIx],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageLegacy);

      return await mobileWallet.signAndSendTransaction(transaction);
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

export function useCounterProgram3() {
  const { connection } = useConnection();
  const mobileWallet = useMobileWallet();
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

  const counterProgram = useMemo(() => {
    return new Program<BasicCounterProgram>(
      idl as BasicCounterProgram,
      counterProgramId,
      new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" })
    );
  }, [counterProgramId]);

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
      return mobileWallet.connectAnd(async (wallet, authorizedAccount) => {
        const initializeIx = await counterProgram.methods
          .initialize()
          .accounts({
            counter: counterPDA,
            payer: authorizedAccount.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction();

        const latestBlockhash = await connection.getLatestBlockhash();

        const messageLegacy = new TransactionMessage({
          payerKey: authorizedAccount.publicKey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: [initializeIx],
        }).compileToV0Message();

        const initializeTx = new VersionedTransaction(messageLegacy);

        const txSignatures = await wallet.signAndSendTransactions({
          transactions: [initializeTx],
        });

        return txSignatures[0];
      });
    },
    onSuccess: (signature: string) => {
      return [signature, counterAccount.refetch()];
    },
    onError: (error: Error) => alertAndLog(error.name, error.message),
  });

  const incrementCounter = useMutation({
    mutationKey: ["counter", "increment"],
    mutationFn: async ({
      payer,
      amount,
    }: {
      payer: PublicKey;
      amount: number;
    }) => {
      const incrementIx = await counterProgram.methods
        .increment(new anchor.BN(amount))
        .accounts({
          counter: counterPDA,
        })
        .instruction();

      const latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [incrementIx],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageLegacy);

      return await mobileWallet.signAndSendTransaction(transaction);
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
