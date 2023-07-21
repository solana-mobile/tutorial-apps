import React, {useState, useCallback} from 'react';
import {
  View,
  Image,
  Button,
  ActivityIndicator,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Linking,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Metaplex} from '@metaplex-foundation/js';

import uploadToIPFS from '../ipfs/uploadToIPFS';
import useMetaplex from '../metaplex-util/useMetaplex';
import {useAuthorization} from './providers/AuthorizationProvider';
import {RPC_ENDPOINT, useConnection} from './providers/ConnectionProvider';

enum MintingStep {
  None = 'None',
  SubmittingInfo = 'Submit',
  UploadingImage = 'UploadingImage',
  MintingMetadata = 'MintingMetadata',
  Success = 'Success',
  Error = 'Error',
}

const NftMinter = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mintProgressStep, setMintProgressStep] = useState<MintingStep>(
    MintingStep.None,
  );
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    RPC_ENDPOINT,
  );
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleSelectImage = async () => {
    const photo = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });
    const selectedPhoto = photo?.assets?.[0];
    if (!selectedPhoto?.uri) {
      console.warn('Selected photo not found');
      return;
    }
    setSelectedImage(selectedPhoto.uri);
  };

  const mintNft = useCallback(
    async (metaplexInstance: Metaplex, imagePath: string) => {
      setMintProgressStep(MintingStep.UploadingImage);

      const [imageUploadData, metadataUploadData] = await uploadToIPFS(
        imagePath,
        nftName,
        nftDescription,
      );

      setMintProgressStep(MintingStep.MintingMetadata);

      const {nft, response} = await metaplexInstance.nfts().create({
        name: nftName,
        uri: `https://ipfs.io/ipfs/${metadataUploadData.value.cid}`,
        sellerFeeBasisPoints: 0,
        tokenOwner: selectedAccount?.publicKey,
      });
      return [nft.address.toBase58(), response.signature];
    },
    [connection],
  );

  const isLoading =
    mintProgressStep === MintingStep.MintingMetadata ||
    mintProgressStep === MintingStep.UploadingImage;

  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image source={{uri: selectedImage}} style={styles.image} />
      )}

      <View style={styles.buttonGroup}>
        <View style={styles.pickImageButton}>
          <Button
            onPress={handleSelectImage}
            title="Pick an image"
            disabled={isLoading}
          />
        </View>
        <View style={styles.mintButton}>
          <Button
            onPress={() => {
              setMintProgressStep(MintingStep.SubmittingInfo);
            }}
            title="Mint NFT"
            disabled={isLoading}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={mintProgressStep !== MintingStep.None}>
        <TouchableWithoutFeedback
          onPress={() => setMintProgressStep(MintingStep.None)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {(() => {
                switch (mintProgressStep) {
                  case MintingStep.UploadingImage:
                  case MintingStep.MintingMetadata:
                    return (
                      <>
                        <Text style={styles.modalText}>
                          {mintProgressStep === MintingStep.UploadingImage
                            ? 'Uploading to IPFS...'
                            : 'Minting NFT...'}
                        </Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                      </>
                    );
                  case MintingStep.Error:
                    return (
                      <>
                        <Text style={styles.modalText}>
                          An error has occured during minting
                        </Text>
                      </>
                    );
                  case MintingStep.Success:
                    const explorerUrl =
                      'https://explorer.solana.com/address/' +
                      mintAddress +
                      '?cluster=' +
                      RPC_ENDPOINT;

                    return (
                      <>
                        <Text style={{fontWeight: 'bold'}}>
                          Mint successful!{' '}
                        </Text>
                        <Text
                          onPress={() => {
                            Linking.openURL(explorerUrl);
                          }}
                          style={{
                            ...styles.modalText,
                            color: '#0000EE',
                            textDecorationLine: 'underline',
                          }}>
                          View your NFT on the explorer.
                        </Text>
                      </>
                    );
                  case MintingStep.None:
                  case MintingStep.SubmittingInfo:
                    return (
                      <View style={styles.inputContainer}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                          NFT Metadata
                        </Text>
                        <Text>Name: </Text>
                        <TextInput
                          style={styles.input}
                          autoCorrect={false}
                          placeholder="Enter text"
                          onChangeText={text => setNftName(text)}
                          value={nftName}
                        />
                        <Text>Description: </Text>
                        <TextInput
                          style={styles.input}
                          autoCorrect={false}
                          placeholder="Enter text"
                          onChangeText={text => setNftDescription(text)}
                          value={nftDescription}
                        />
                        <Button
                          title="Mint NFT!"
                          onPress={async () => {
                            if (!metaplex || !selectedImage) {
                              console.warn(
                                'Metaplex/MWA not initialized or Image not selected.',
                              );
                              return;
                            }
                            let mintAddress, txSignature;
                            try {
                              [mintAddress, txSignature] = await mintNft(
                                metaplex,
                                selectedImage,
                              );
                              console.log(`Mint Successful
                              Mint Address: ${mintAddress}
                              Signature: ${txSignature}`);
                              setMintProgressStep(MintingStep.Success);
                              setMintAddress(mintAddress);
                              setTxSignature(txSignature);
                            } catch (error) {
                              setMintProgressStep(MintingStep.Error);
                              console.error(error);
                              throw error;
                            }
                          }}
                        />
                      </View>
                    );
                }
              })()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: 200,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickImageButton: {
    marginHorizontal: 4,
    width: '50%',
  },
  mintButton: {
    marginHorizontal: 4,
    width: '50%',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default NftMinter;
