import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = Readonly<{
  isVisible: boolean;
  onClose: () => void;
  onResetPress: () => void;
}>;

export default function ResetWalletModal({
  isVisible,
  onClose,
  onResetPress,
}: Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.centeredView}>
          <Text style={styles.modalTitle}>Reset Player Wallet</Text>
          <Text style={styles.modalBody}>
            This action will replace the current burner wallet stored locally on
            your device.
            {'\n'}
            {'\n'}
            <Text style={{fontWeight: 'bold'}}>
              Any existing funds will be lost!
            </Text>
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}>
              <View>
                <Text style={styles.modalButtonTitle}>Go Back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onResetPress();
              }}>
              <View>
                <Text style={[styles.modalButtonTitle, {color: '#FC3D39'}]}>
                  Reset
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  sectionHeader: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  optionsSection: {
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 18,
  },
  divider: {
    borderWidth: 1,
    borderColor: 'rgba(111, 111, 111, 0.2)',
    marginTop: 24,
    marginBottom: 12,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSpacer: {
    paddingHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
  },
  centeredView: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 36,
    paddingTop: 36,
    paddingBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 16,
  },
  modalBody: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'justify',
    paddingBottom: 32,
  },
  modalButtonContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButtonTitle: {
    fontWeight: 'bold',
  },
});
