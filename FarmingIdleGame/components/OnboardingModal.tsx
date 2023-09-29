import {Entypo} from '@expo/vector-icons';
import {useCallback, useState} from 'react';
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
            <View style={styles.onboardingContent}>
              {onboardingScreens[currentIndex]}
            </View>
          </View>
          <View style={styles.navContainer}>
            <TouchableOpacity
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndex(currentIndex - 1)}>
              <View style={styles.navButton}>
                {currentIndex === 0 ? null : (
                  <Text style={styles.navButtonText}>{'<'}</Text>
                )}
              </View>
            </TouchableOpacity>
            <Text>
              {currentIndex + 1} / {onboardingScreens.length}{' '}
            </Text>
            {currentIndex === onboardingScreens.length - 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(0);
                  onClose();
                }}>
                <View style={styles.playButton}>
                  <View style={styles.navButton}>
                    <Text style={styles.playButtonText}>{'✔️'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setCurrentIndex(currentIndex + 1)}>
                <View style={styles.navButton}>
                  <Text style={styles.navButtonText}>{'>'}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    height: 250,
  },
  navContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navButton: {
    minWidth: 150,
    alignItems: 'center',
    paddingVertical: 8,
  },
  playButton: {
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default OnboardingModal;
