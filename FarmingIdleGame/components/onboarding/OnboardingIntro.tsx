import {Text} from 'react-native';

import OnboardingModalPage from './OnboardingModalPage';

export default function OnboardingIntro() {
  return (
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
    </OnboardingModalPage>
  );
}
