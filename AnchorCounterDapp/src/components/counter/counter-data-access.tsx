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

// Match the exact Rust program account structure
interface CounterAccount {
  count: number;  // Changed from anchor.BN to number to match Rust u64
  bump: number;   // Matches Rust u8
}

// Update the CounterAccountStatus type to include raw data
type CounterAccountStatus = {
  status: 'no-program' | 'not-initialized' | 'initialized' | 'error';
  data: CounterAccount | null;
  error?: Error;
  rawData?: Buffer;
};

// Constant for the program ID
const COUNTER_PROGRAM_ID = "3sFQdgDGSKryFsFFB5dF9NoN94cEatjM37g6v8zAJWm6";

export function useCounterProgram() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  // Create program ID from constant
  const counterProgramId = useMemo(() => {
    return new PublicKey(COUNTER_PROGRAM_ID);
  }, []);

  // Derive PDA for counter account
  const [counterPDA] = useMemo(() => {
    const counterSeed = anchor.utils.bytes.utf8.encode("counter");
    return anchor.web3.PublicKey.findProgramAddressSync(
      [counterSeed],
      counterProgramId
    );
  }, [counterProgramId]);

  // Create provider when wallet is available
  const provider = useMemo(() => {
    if (!anchorWallet) {
      return;
    }
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "confirmed",
      commitment: "processed",
    });
  }, [anchorWallet, connection]);

  // Initialize program with provider
  const counterProgram = useMemo(() => {
    if (!provider) {
      return;
    }

    // Create program instance with correct argument order
    const program = new Program(
      idl as anchor.Idl,
      provider
    ) as Program<BasicCounterProgram>;

    console.log("Counter program initialized with ID:", program.programId.toBase58());
    return program;
  }, [provider]); // Note: removed counterProgramId from dependencies

  // Query counter account data
  const counterAccount = useQuery<CounterAccountStatus>({
    queryKey: ["get-counter-account", counterPDA.toBase58()],
    queryFn: async (): Promise<CounterAccountStatus> => {
      if (!counterProgram) {
        console.log("Program not initialized - waiting for wallet");
        return { status: "no-program", data: null };
      }
  
      try {
        console.log("Checking counter account:", counterPDA.toBase58());
        
        const account = await connection.getAccountInfo(counterPDA);
        
        if (!account) {
          return { status: "not-initialized", data: null };
        }
  
        console.log("PDA exists - account initialized");
        
        const rawData = Buffer.from(account.data);
        console.log("Raw account data (hex):", rawData.toString('hex'));
        
        // DIRECT MANUAL DESERIALIZATION (REPLACES ANCHOR DECODING)
        try {
          // Account structure: 
          //   - 8-byte discriminator
          //   - 8-byte u64 (little-endian count)
          //   - 1-byte u8 (bump)
          if (rawData.length < 17) {
            throw new Error(`Invalid account data: Expected 17 bytes, got ${rawData.length}`);
          }
          
          // Extract count (bytes 8-15, little-endian)
          const countBytes = rawData.slice(8, 16);
          // Convert to hex string for manual little-endian conversion
          const hexString = countBytes.toString('hex');
          // Parse as big-endian hex (since we'll reverse bytes)
          const count = parseInt(
            hexString.match(/../g)?.reverse().join('') || '0', 
            16
          );
          
          // Extract bump (byte 16)
          const bump = rawData[16];
          
          console.log("Manually decoded:", { count, bump });
          
          return {
            status: "initialized",
            data: { count, bump },
            rawData
          };
        } catch (error) {
          console.error("Manual deserialization failed:", error);
          return {
            status: "initialized",
            data: null,
            rawData,
            error: error as Error
          };
        }
      } catch (error) {
        console.error("Account fetch error:", error);
        return {
          status: "error",
          data: null,
          error: error as Error
        };
      }
    },
    refetchInterval: 2000,
  });

  // Initialize counter mutation
  const initializeCounter = useMutation({
    mutationKey: ["counter", "initialize"],
    mutationFn: async () => {
      if (!counterProgram || !anchorWallet) {
        throw Error("Counter program not instantiated");
      }

      console.log("Initializing counter at:", counterPDA.toBase58());
      return await counterProgram.methods
        .initialize()
        .accounts({
          // counter: counterPDA,
          payer: anchorWallet.publicKey,
          // systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: async (signature: string) => {
      console.log("Initialize success:", signature);
      alertAndLog("Counter Initialized Successfully!!!", `Signature: ${signature}`);
      //Refetch counter account
      await counterAccount.refetch();
    },
    onError: (error: Error) => {
      console.log("Initialize error:", error);
      alertAndLog(error.name, error.message);
    },
  });

  // Increment counter mutation
  const incrementCounter = useMutation({
    mutationKey: ["counter", "increment"],
    mutationFn: async (amount: number) => {
      if (!counterProgram) {
        throw Error("Counter program not instantiated");
      }

      console.log(`Incrementing counter by ${amount}`);
      return await counterProgram.methods
        .increment(new anchor.BN(amount))
        .accounts({
          counter: counterPDA,
        })
        .rpc();
    },
    onSuccess: async (signature: string, amount: number) => {
      console.log("Increment success:", signature);
      alertAndLog(`Counter Incremented By ${amount} Successfully!!!`, `Signature: ${signature}`);
      //Refetch counter account
      await counterAccount.refetch();
    },
    onError: (error: Error) => {
      console.log("Increment error:", error);
      alertAndLog(error.name, error.message);
    },
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
