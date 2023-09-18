import {Entypo} from '@expo/vector-icons';
import {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import HowToCrops from './HowToCrops';
import HowToPlay from './HowToPlay';
import OnboardingDepositPage from './onboarding/OnboardingDepositPage';
import OnboardingGamePage from './onboarding/OnboardingGamePage';
import OnboardingIntroPage from './onboarding/OnboardingIntroPage';
import OnboardingModalPage from './onboarding/OnboardingModalPage';

type Props = Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>;

const OnboardingModal = ({isVisible, onClose}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onboardingScreens = [
    <OnboardingModalPage title="Welcome!">
      <Text>
        This is an on-chain clicker game built on Solana, created for
        educational purposes. {'\n'}
        {'\n'}
      </Text>
      <Text>
        The source code for the Expo app and the on-chain program is fully open
        source. {'\n'}
      </Text>
    </OnboardingModalPage>,
    <OnboardingModalPage title="Getting Started">
      <Text>
        Deposit 0.001 SOL into a burner wallet, used to sign for transactions
        without disrupting gameplay. {'\n'}
        {'\n'}
      </Text>
      <Text>
        The burner wallet is unsafe and uninstalling the app will lose access to
        the wallet! {'\n'}
      </Text>
    </OnboardingModalPage>,
    <OnboardingModalPage title="Harvesting Crops">
      <Text>
        Press the floating farm to harvest your crops. Initially, you gain +1
        per harvest. {'\n'}
        {'\n'}
      </Text>
      <Text>Each 'harvest' action is an on-chain transaction! {'\n'}</Text>
    </OnboardingModalPage>,
    <OnboardingModalPage title="Upgrading the farm">
      <Text>
        You can purchase upgrades to your farm in the Crops screen. {'\n'}
        {'\n'}
      </Text>
      <Text>
        Each crop upgrade increases the passive yield of your farm! {'\n'}
      </Text>
    </OnboardingModalPage>,
    <OnboardingModalPage title="Submit your highscore">
      <Text>
        When finished, submit your highscore and reset your farm. {'\n'}
        {'\n'}
      </Text>
      <Text>
        If you score high enough, your farm appears in the global Top 5
        leaderboards!
        {'\n'}
      </Text>
    </OnboardingModalPage>,
  ];

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.onboardingContainer}>
            <View style={styles.modalNavButton}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentIndex(currentIndex - 1)}>
                  <Entypo name="chevron-thin-left" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.onboardingContent}>
              {onboardingScreens[currentIndex]}
            </View>
            <View style={styles.modalNavButton}>
              {currentIndex < onboardingScreens.length - 1 && (
                <TouchableOpacity
                  onPress={() => setCurrentIndex(currentIndex + 1)}>
                  <Entypo name="chevron-thin-right" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={{marginTop: 50}} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalNavButton: {
    alignItems: 'center',
    width: '10%',
  },
  centeredView: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onboardingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 200,
  },
});

export default OnboardingModal;
