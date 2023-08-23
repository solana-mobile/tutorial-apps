import * as anchor from '@coral-xyz/anchor';
import {PublicKey} from '@solana/web3.js';

export type FarmAccount = {
  initialized: boolean;
  harvestPoints: anchor.BN;
  dateCreated: anchor.BN;
  lastHarvested: anchor.BN;
  owner: PublicKey;
  player: PublicKey;
  farmUpgrades: number[];
};
