import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";

import { BasicCounter as BasicCounterProgram } from "../../../counter-program/target/types/basic_counter";
import idl from "../../../counter-program/target/idl/basic_counter.json";
import { useConnection } from "../../utils/ConnectionProvider";
import { useAnchorWallet } from "../../utils/useAnchorWallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertAndLog } from "../../utils/alertAndLog";

const COUNTER_PROGRAM_ID = "J59JrEwy2LXNdME3hurENgiNDJosRM1YHLUECc1JTijh";

export function useCounterProgram() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const queryClient = useQueryClient();

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
      provider
    );
  }, [counterProgramId, provider]);

  const counterAccount = useQuery({
    queryKey: ["get-counter-account", counterPDA?.toString()],
    queryFn: async () => {
      if (!connection || !counterPDA) {
        return null;
      }

      try {
        // Check if the account exists first
        const accountInfo = await connection.getAccountInfo(counterPDA);
        if (!accountInfo) {
          console.log('Counter account does not exist');
          return null;
        }

        console.log('Counter account exists with data length:', accountInfo.data.length);
        
        // Try to decode with Anchor first
        if (counterProgram) {
          try {
            const account = await counterProgram.account.counter.fetch(counterPDA);
            console.log('Counter account fetched with Anchor:', account);
            return account;
          } catch (anchorError) {
            console.log('Anchor decode failed, trying manual decode:', anchorError);
          }
        }

        // Manual decode as fallback for buffer issues
        // Counter account structure: 8 bytes discriminator + 8 bytes count + 1 byte bump
        if (accountInfo.data.length >= 16) {
          // Skip the first 8 bytes (discriminator) and read the next 8 bytes as count
          const data = accountInfo.data;
          
          // Manual little-endian decode of 8 bytes starting at offset 8
          let count = 0;
          for (let i = 0; i < 8; i++) {
            count += (data[8 + i] || 0) * Math.pow(256, i);
          }
          
          console.log('Manually decoded count:', count);
          return { 
            count: new BN(count),
            bump: data[16] || 0 // The bump byte
          };
        }

        console.log('Account exists but insufficient data');
        return { count: new BN(0), bump: 0 };
        
      } catch (error) {
        console.log('Counter account fetch error:', error);
        return null;
      }
    },
    enabled: !!connection && !!counterPDA,
  });

  const initializeCounter = useMutation({
    mutationKey: ["counter", "initialize"],
    mutationFn: async () => {
      if (!counterProgram) {
        throw Error("Counter program not instantiated");
      }

      return await counterProgram.methods
        .initialize()
        .accounts({})
        .rpc();
    },
    onSuccess: (signature) => {
      console.log('Initialize success:', signature);
      alertAndLog('Success', `Counter initialized! Transaction: ${signature}`);
      queryClient.invalidateQueries({ queryKey: ["get-counter-account"] });
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
        .accounts({})
        .rpc();
    },
    onSuccess: (signature) => {
      console.log('Increment success:', signature);
      alertAndLog('Success', `Counter incremented! Transaction: ${signature}`);
      queryClient.invalidateQueries({ queryKey: ["get-counter-account"] });
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
