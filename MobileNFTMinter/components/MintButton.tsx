import {Metaplex} from '@metaplex-foundation/js';
import {useCallback} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useMetaplex from '../metaplex-util/useMetaplex';
import {MWAWallet, useMWAWallet} from './hooks/useMWAWallet';
import {useAuthorization} from './providers/AuthorizationProvider';
import {RPC_ENDPOINT, useConnection} from './providers/ConnectionProvider';
import uploadToIPFS from '../ipfs/uploadToIPFS';

export default function MintButton() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    RPC_ENDPOINT,
  );
  const mwaWallet = useMWAWallet(authorizeSession, selectedAccount);

  const mintNft = useCallback(
    async (
      metaplexInstance: Metaplex,
      mwaWallet: MWAWallet,
      imagePath: string,
    ) => {
      const [imageUploadData, metadataUploadData] = await uploadToIPFS(
        imagePath,
        'NFT NAME',
        'DESCRIPTION',
      );
      console.log(metadataUploadData);

      const {nft, response} = await metaplexInstance.nfts().create({
        name: 'Test NFT 1',
        symbol: 'sym',
        uri: `https://ipfs.io/ipfs/${metadataUploadData.value.cid}`,
        sellerFeeBasisPoints: 0,
        tokenOwner: selectedAccount?.publicKey,
      });
      return [nft.address.toBase58(), response.signature];
    },
    [connection],
  );

  return (
    <View style={styles.container}>
      <Button
        title="Mint NFT"
        onPress={async () => {
          if (!metaplex || !mwaWallet) {
            console.warn('Metaplex instance or MWA is not initialized.');
            return;
          }

          // Pick a photo.
          const photo = await launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
          });
          const selectedPhoto = photo?.assets?.[0];
          if (!selectedPhoto?.uri) {
            console.warn('Selected photo not found');
            return;
          }
          try {
            const [mintAddress, signature] = await mintNft(
              metaplex,
              mwaWallet,
              selectedPhoto.uri,
            );
            console.log(`Mint Successful
            Mint Address: ${mintAddress}
            Signature: ${signature}`);
          } catch (error) {
            console.error('Minting failed: ' + error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
