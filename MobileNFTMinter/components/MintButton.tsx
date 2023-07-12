import React, {useCallback} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {useAuthorization} from './providers/AuthorizationProvider';
import {useConnection, RPC_ENDPOINT} from './providers/ConnectionProvider';
import useMetaplex from '../metaplex-util/useMetaplex';
import {PublicKey} from '@solana/web3.js';
import {
  Metaplex,
  migrateToSizedCollectionNftBuilder,
  toMetaplexFile,
  NftBuildersClient,
  toMetaplexFileFromBrowser,
} from '@metaplex-foundation/js';
import RNFetchBlob from 'rn-fetch-blob';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const img = require('../img/pig.png');

const SAGA_GENSIS_TOKEN_MINT = '3ijFZcJKmp1EnDbbuaumWYvEFbztx9NRupwTXTchK9bP';

export default function MintButton() {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    RPC_ENDPOINT,
  );

  const mintNft = useCallback(
    async (metaplexInstance: Metaplex) => {
      const result = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
      });
      console.log(result);
      const selectedPhoto = result?.assets?.[0];
      console.log(selectedPhoto);
      console.log(RNFetchBlob.fs.dirs.CacheDir);

      if (!selectedPhoto?.uri || !selectedPhoto?.fileName) {
        return;
      }

      const doesExist = selectedPhoto.uri
        ? await RNFetchBlob.fs.exists(selectedPhoto.uri)
        : false;
      console.log(doesExist);
      const data = await RNFetchBlob.fs.readFile(selectedPhoto.uri, 'base64');
      console.log(data);
      const metaplexFile = toMetaplexFile(data, selectedPhoto.fileName);
      console.log(metaplexFile);

      // const {metadata, uri, assetUris} = await metaplexInstance
      //   .nfts()
      //   .uploadMetadata({
      //     name: 'Test NFT 1',
      //     symbol: 'Test symbol 1',
      //     description: 'Test description 1',
      //     image: metaplexFile,
      //   });
      // console.log('Finished metaplex upload');
      // console.log(uri);
      // console.log(metadata);
      // console.log(assetUris);

      const {nft, response} = await metaplexInstance.nfts().create({
        name: 'Test NFT 1',
        symbol: 'sym',
        uri: 'https://google.com',
        sellerFeeBasisPoints: 0,
        tokenOwner: selectedAccount?.publicKey,
      });
      console.log(nft);
      console.log(nft.address.toBase58());
      console.log(response);

      // const path = RNFetchBlob.wrap(RNFetchBlob.fs.asset('img/pig.png'));
      // console.log(path);
      // const ls = await RNFetchBlob.fs.ls(
      //   RNFetchBlob.fs.dirs.MainBundleDir + '/files',
      // );
      // console.log(ls);
      // const doesExist = await RNFetchBlob.fs.exists(
      //   RNFetchBlob.fs.dirs.MainBundleDir + '/pig.png',
      // );
      // console.log(doesExist);
      // const data = await RNFetchBlob.fs.readFile(path, 'base64');
      // Upload the image and metadata to arweave/bundlr
      // const {uri} = await metaplexInstance.nfts().uploadMetadata({
      //   name: 'Test NFT 1',
      //   symbol: 'Test symbol 1',
      //   description: 'Test description 1',
      //   image: await toMetaplexFileFromBrowser(image),
      // });
      // // Mint the metadata account
      // const {nft, response} = await metaplexInstance.nfts().create({
      //   name,
      //   symbol,
      //   uri: uri,
      //   sellerFeeBasisPoints: 0,
      //   tokenOwner: wallet.publicKey,
      //   mintTokens: true,
      //   collection,
      // });
      // return [nft.address.toBase58(), response.signature];
    },
    [selectedAccount?.publicKey],
  );

  return (
    <View style={styles.container}>
      <Button
        title="Mint NFT"
        onPress={async () => {
          if (!metaplex) {
            console.warn('Metaplex instance is not initialized.');
            return;
          }
          await mintNft(metaplex);
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
