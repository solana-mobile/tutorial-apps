import React, {useState} from 'react';
import {
  View,
  Image,
  Button,
  ActivityIndicator,
  Modal,
  Text,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const NftMinter = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mintProgressStep, setMintProgressStep] = useState<string>('none');

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

  const handleMintNft = async () => {
    setLoading(true);
    setModalVisible(true);

    try {
      setTimeout(() => {}, 5000);
      //   await mintNft(selectedImage); // replace this with your actual minting function
      // Do whatever you need to do after successful minting
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

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
            disabled={loading}
          />
        </View>
        <View style={styles.mintButton}>
          <Button onPress={handleMintNft} title="Mint NFT" disabled={loading} />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <Modal
        onDismiss={() => {}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Minting in progress...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
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
