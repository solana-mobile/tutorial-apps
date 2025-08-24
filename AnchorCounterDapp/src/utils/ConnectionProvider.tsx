import { Connection, type ConnectionConfig } from "@solana/web3.js";
import { Buffer } from "buffer";
import React, {
  type FC,
  type ReactNode,
  useMemo,
  createContext,
  useContext,
} from "react";
import { useCluster } from "../components/cluster/cluster-data-access";

export interface ConnectionProviderProps {
  children: ReactNode;
  config?: ConnectionConfig;
}

export const ConnectionProvider: FC<ConnectionProviderProps> = ({
  children,
  config = { commitment: "confirmed" },
}) => {
  const { selectedCluster } = useCluster();

  const connection = useMemo(() => {
    const conn = new Connection(selectedCluster.endpoint, config);

    // Ensure account data returned from getAccountInfo is a Node Buffer.
    // Anchor's account decoder expects Buffer methods like readUIntLE.
    const originalGetAccountInfo = conn.getAccountInfo.bind(conn) as any;
    (conn as any).getAccountInfo = async (pubkey: any, commitment?: any) => {
      const info = await originalGetAccountInfo(pubkey, commitment);
      if (info && info.data && !Buffer.isBuffer(info.data)) {
        try {
          info.data = Buffer.from(info.data);
        } catch (e) {
          // If conversion fails, leave as-is and let caller handle the error
          console.warn('Failed to convert account data to Buffer', e);
        }
      }
      return info;
    };

    return conn;
  }, [selectedCluster, config]);

  return (
    <ConnectionContext.Provider value={{ connection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export interface ConnectionContextState {
  connection: Connection;
}

export const ConnectionContext = createContext<ConnectionContextState>(
  {} as ConnectionContextState
);

export function useConnection(): ConnectionContextState {
  return useContext(ConnectionContext);
}
