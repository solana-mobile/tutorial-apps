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
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Metaplex} from '@metaplex-foundation/js';

import uploadToIPFS from '../ipfs/uploadToIPFS';
import useMetaplex from '../metaplex-util/useMetaplex';
import {MWAWallet, useMWAWallet} from './hooks/useMWAWallet';
import {useAuthorization} from './providers/AuthorizationProvider';
import {RPC_ENDPOINT, useConnection} from './providers/ConnectionProvider';

enum MintingStep {
  None = 'None',
  SubmittingInfo = 'Submit',
  UploadingImage = 'UploadingImage',
  MintingMetadata = 'MintingMetadata',
}

const NftMinter = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mintProgressStep, setMintProgressStep] = useState<MintingStep>(
    MintingStep.None,
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const {selectedAccount, authorizeSession} = useAuthorization();
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(
    connection,
    selectedAccount,
    authorizeSession,
    RPC_ENDPOINT,
  );
  const mwaWallet = useMWAWallet(authorizeSession, selectedAccount);

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
    async (
      metaplexInstance: Metaplex,
      mwaWallet: MWAWallet,
      imagePath: string,
    ) => {
      setMintProgressStep(MintingStep.UploadingImage);

      const [imageUploadData, metadataUploadData] = await uploadToIPFS(
        imagePath,
        'NFT NAME',
        'DESCRIPTION',
      );

      setMintProgressStep(MintingStep.MintingMetadata);

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

  const isLoading =
    mintProgressStep === MintingStep.MintingMetadata ||
    mintProgressStep === MintingStep.UploadingImage;
  console.log(mintProgressStep);
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
              {isLoading ? (
                <>
                  <Text style={styles.modalText}>
                    {mintProgressStep === MintingStep.MintingMetadata
                      ? 'Minting NFT...'
                      : 'Uploading to IPFS...'}
                  </Text>
                  <ActivityIndicator size="large" color="#0000ff" />
                </>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    NFT Metadata
                  </Text>
                  <Text>Name: </Text>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    placeholder="Enter text"
                    onChangeText={text => setName(text)}
                    value={name}
                  />
                  <Text>Description: </Text>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    placeholder="Enter text"
                    onChangeText={text => setDescription(text)}
                    value={description}
                  />
                  <Button
                    title="Mint NFT!"
                    onPress={async () => {
                      if (!metaplex || !mwaWallet || !selectedImage) {
                        console.warn(
                          'Metaplex/MWA not initialized or Image not selected.',
                        );
                        return;
                      }
                      try {
                        const [mintAddress, txSignature] = await mintNft(
                          metaplex,
                          mwaWallet,
                          selectedImage,
                        );
                      } catch (error) {
                        console.error('Error occured during minting');
                        console.error(error);
                      } finally {
                        setMintProgressStep(MintingStep.None);
                      }
                    }}
                  />
                </View>
              )}
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
