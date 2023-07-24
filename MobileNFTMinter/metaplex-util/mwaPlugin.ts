import {
  IdentitySigner,
  Metaplex,
  MetaplexPlugin,
} from '@metaplex-foundation/js';

export const mobileWalletAdapterIdentity = (
  mwaIdentitySigner: IdentitySigner,
): MetaplexPlugin => ({
  install(metaplex: Metaplex) {
    metaplex.identity().setDriver(mwaIdentitySigner);
  },
});
