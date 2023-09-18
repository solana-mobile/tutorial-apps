import {Text} from 'react-native';

import OnboardingModalPage from './OnboardingModalPage';

export default function OnboardingHarvest() {
  return (
    <OnboardingModalPage title="Harvesting Crops">
      <Text>
        Press the floating farm to harvest your crops. Initially, you gain +1
        per harvest. {'\n'}
        {'\n'}
      </Text>
      <Text>Each 'harvest' action is an on-chain transaction! {'\n'}</Text>
    </OnboardingModalPage>
  );
}
