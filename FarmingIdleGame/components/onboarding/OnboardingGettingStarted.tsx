import {Text} from 'react-native';

import OnboardingModalPage from './OnboardingModalPage';

export default function OnboardingGettingStarted() {
  return (
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
    </OnboardingModalPage>
  );
}
