import {Entypo} from '@expo/vector-icons';
import {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import OnboardingGettingStarted from './onboarding/OnboardingGettingStarted';
import OnboardingHarvest from './onboarding/OnboardingHarvest';
import OnboardingIntro from './onboarding/OnboardingIntro';
import OnboardingSubmit from './onboarding/OnboardingSubmit';
import OnboardingUpgrade from './onboarding/OnboardingUpgrade';

type Props = Readonly<{
  isVisible: boolean;
  onClose: () => void;
}>;

const OnboardingModal = ({isVisible, onClose}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onboardingScreens = [
    <OnboardingIntro />,
    <OnboardingGettingStarted />,
    <OnboardingHarvest />,
    <OnboardingUpgrade />,
    <OnboardingSubmit />,
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
