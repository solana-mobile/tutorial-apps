import {Text} from 'react-native';

import OnboardingModalPage from './OnboardingModalPage';

export default function OnboardingUpgrade() {
  return (
    <OnboardingModalPage title="Upgrading the farm">
      <Text>
        You can purchase upgrades to your farm in the Crops screen. {'\n'}
        {'\n'}
      </Text>
      <Text>
        Each crop upgrade increases the passive yield of your farm! {'\n'}
      </Text>
    </OnboardingModalPage>
  );
}
